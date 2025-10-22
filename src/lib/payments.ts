import { API_BASE_URL } from "./auth"

export interface SavedCard {
  id: string | number
  brand: string
  last4: string
  expMonth: number
  expYear: number
  holderName?: string
  isDefault?: boolean
}

// ============
// Local storage fallback for saved cards (per user)
// ============
const LOCAL_CARDS_KEY = (userId: string | number) => `zapateria_saved_cards_${userId}`

function readLocalCards(userId: string | number): SavedCard[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(LOCAL_CARDS_KEY(userId))
  if (!raw) return []
  try {
    const arr = JSON.parse(raw) as SavedCard[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function writeLocalCards(userId: string | number, cards: SavedCard[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LOCAL_CARDS_KEY(userId), JSON.stringify(cards))
}

function detectBrand(cardNumberDigits: string): string {
  if (/^4/.test(cardNumberDigits)) return "visa"
  if (/^5[1-5]/.test(cardNumberDigits)) return "mastercard"
  if (/^3[47]/.test(cardNumberDigits)) return "amex"
  if (/^6(?:011|5)/.test(cardNumberDigits)) return "discover"
  return "card"
}

function parseSavedCards(payload: unknown): SavedCard[] {
  if (Array.isArray(payload)) {
    return payload as SavedCard[]
  }
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: SavedCard[] }).data
  }
  throw new Error("Formato de respuesta inesperado al obtener tarjetas")
}

export async function fetchSavedCards(userId: string | number): Promise<SavedCard[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/cards`, {
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      // Treat 404 as "no cards" to keep UI smooth until backend exists
      if (response.status === 404) return []
      const message = await response.text()
      throw new Error(message || "No se pudieron obtener las tarjetas guardadas")
    }

    const data = await response.json()
    const remote = parseSavedCards(data)
    // Merge with local cards (avoid duplicates by last4 + exp)
    const local = readLocalCards(userId)
    const key = (c: SavedCard) => `${c.last4}-${c.expMonth}-${c.expYear}`
    const seen = new Set(remote.map(key))
    const merged = [...remote]
    for (const c of local) {
      const k = key(c)
      if (!seen.has(k)) {
        merged.push(c)
      }
    }
    return merged
  } catch (error) {
    if (error instanceof TypeError) {
      // Network/unreachable API – leave UI ready but with no cards
      return readLocalCards(userId)
    }
    // For any other parse/unknown errors, return empty for now
    return readLocalCards(userId)
  }
}

export function formatSavedCardLabel(card: SavedCard): string {
  const yy = String(card.expYear).slice(-2)
  const mm = String(card.expMonth).padStart(2, "0")
  const brand = card.brand?.toUpperCase?.() || "CARD"
  const last4 = card.last4 || "••••"
  return `${brand} •••• ${last4} — ${mm}/${yy}`
}

export function saveCardForUser(userId: string | number, input: {
  cardNumber: string
  expiration: string // MM/YY or MM/YYYY
  holderName?: string
}): SavedCard | null {
  // Extract digits from card number and get last4
  const digits = (input.cardNumber || "").replace(/\D+/g, "")
  if (digits.length < 4) return null
  const last4 = digits.slice(-4)

  // Parse expiration
  const match = (input.expiration || "").match(/^(\d{1,2})\/(\d{2,4})$/)
  if (!match) return null
  const expMonth = Math.max(1, Math.min(12, Number(match[1])))
  const yearRaw = match[2]
  const expYear = yearRaw.length === 2 ? Number(`20${yearRaw}`) : Number(yearRaw)
  if (!Number.isFinite(expYear)) return null

  const brand = detectBrand(digits)
  const newCard: SavedCard = {
    id: `local-${Date.now()}`,
    brand,
    last4,
    expMonth,
    expYear,
    holderName: input.holderName || undefined,
  }

  const existing = readLocalCards(userId)
  const key = (c: SavedCard) => `${c.last4}-${c.expMonth}-${c.expYear}`
  const exists = existing.some((c) => key(c) === key(newCard))
  const next = exists ? existing : [newCard, ...existing]
  writeLocalCards(userId, next)
  return newCard
}

// =========================
// Payments API (backend contract)
// =========================

// Matches backend Payment shape exactly
export interface ApiPayment {
  id: number
  full_name: string
  email: string
  address: string | null
  city: string | null
  country: string | null
  card_last4: string
  exp_month: number
  exp_year: number
  amount: string // decimal serialized
  currency: string
  payment_token: string | null
  created_at: string
  updated_at: string
}

export interface CreatePaymentBody {
  full_name: string
  email: string
  address: string
  city?: string
  country?: string
  card_number: string
  expiration: string // MM/YY or MM/YYYY
  ccv: string
  amount: number
  currency?: string
  payment_token?: string | null
}

export interface UpdatePaymentBody {
  full_name?: string
  email?: string
  address?: string
  city?: string
  country?: string
  amount?: number
  currency?: string
}

export interface LaravelPaginator<T> {
  current_page: number
  data: T[]
  per_page: number
  total: number
  [key: string]: unknown
}

function parsePayment(payload: unknown): ApiPayment {
  if (!payload || typeof payload !== "object") {
    throw new Error("Respuesta inválida de pago")
  }
  if ("data" in payload) {
    return (payload as { data: ApiPayment }).data
  }
  return payload as ApiPayment
}

function parsePaymentList(payload: unknown): LaravelPaginator<ApiPayment> {
  if (!payload || typeof payload !== "object") {
    throw new Error("Respuesta inválida al listar pagos")
  }
  if (
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return payload as LaravelPaginator<ApiPayment>
  }
  // Accept plain array as a fallback for non-paginated dev stubs
  if (Array.isArray(payload)) {
    return {
      current_page: 1,
      data: payload as ApiPayment[],
      per_page: (payload as ApiPayment[]).length,
      total: (payload as ApiPayment[]).length,
    }
  }
  throw new Error("Formato de paginación inesperado")
}

function extractValidationMessage(_resp: Response, bodyText: string): string {
  try {
    const json = JSON.parse(bodyText)
    if (json?.message && json?.errors) {
      const firstField = Object.keys(json.errors)[0]
      const firstMsg = Array.isArray(json.errors[firstField]) ? json.errors[firstField][0] : undefined
      return firstMsg || json.message
    }
    if (json?.message) return json.message
  } catch {
    // ignore
  }
  return bodyText || "Solicitud inválida"
}

export async function createPayment(body: CreatePaymentBody): Promise<ApiPayment> {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    if (response.status === 422) {
      throw new Error(extractValidationMessage(response, text))
    }
    throw new Error(text || "No se pudo crear el pago")
  }

  const data = await response.json()
  return parsePayment(data)
}

export async function listPayments(params?: { page?: number; per_page?: number }): Promise<LaravelPaginator<ApiPayment>> {
  const q = new URLSearchParams()
  if (params?.page) q.set("page", String(params.page))
  if (params?.per_page) q.set("per_page", String(params.per_page))
  const url = `${API_BASE_URL}/payments${q.size ? `?${q.toString()}` : ""}`
  const response = await fetch(url, { headers: { "Content-Type": "application/json" } })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "No se pudieron obtener los pagos")
  }
  const data = await response.json()
  return parsePaymentList(data)
}

export async function getPayment(id: string | number): Promise<ApiPayment> {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, { headers: { "Content-Type": "application/json" } })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "No se pudo obtener el pago solicitado")
  }
  const data = await response.json()
  return parsePayment(data)
}

export async function updatePayment(id: string | number, body: UpdatePaymentBody): Promise<ApiPayment> {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const text = await response.text()
    if (response.status === 422) {
      throw new Error(extractValidationMessage(response, text))
    }
    throw new Error(text || "No se pudo actualizar el pago")
  }
  const data = await response.json()
  return parsePayment(data)
}

export async function deletePayment(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, { method: "DELETE" })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "No se pudo eliminar el pago")
  }
}

// Helper: build create body from UI model
export function buildCreatePaymentBody(input: {
  fullName: string
  email: string
  address: string
  city?: string
  country?: string
  cardNumber: string
  expiration: string
  cvv: string
  amount: number
  currency?: string
  paymentToken?: string | null
}): CreatePaymentBody {
  return {
    full_name: input.fullName,
    email: input.email,
    address: input.address,
    city: input.city,
    country: input.country,
    card_number: input.cardNumber,
    expiration: input.expiration,
    ccv: input.cvv,
    amount: input.amount,
    currency: input.currency ?? "USD",
    payment_token: input.paymentToken ?? null,
  }
}
