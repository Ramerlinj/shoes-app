export interface CheckoutPreset {
  id: string | number
  fullName: string
  email: string
  address: string
  city?: string
  country?: string
  card: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
    holderName?: string
  }
}

const LOCAL_PRESETS_KEY = (userId: string | number) => `zapateria_presets_${userId}`

function readLocalPresets(userId: string | number): CheckoutPreset[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(LOCAL_PRESETS_KEY(userId))
  if (!raw) return []
  try {
    const arr = JSON.parse(raw) as CheckoutPreset[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function writeLocalPresets(userId: string | number, presets: CheckoutPreset[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LOCAL_PRESETS_KEY(userId), JSON.stringify(presets))
}

function detectBrand(cardDigits: string): string {
  if (/^4/.test(cardDigits)) return "visa"
  if (/^5[1-5]/.test(cardDigits)) return "mastercard"
  if (/^3[47]/.test(cardDigits)) return "amex"
  if (/^6(?:011|5)/.test(cardDigits)) return "discover"
  return "card"
}

export function fetchCheckoutPresets(userId: string | number): CheckoutPreset[] {
  // For now local-only; can be extended to call API later
  return readLocalPresets(userId)
}

export function saveCheckoutPresetForUser(userId: string | number, input: {
  fullName: string
  email: string
  address: string
  city?: string
  country?: string
  cardNumber: string
  expiration: string // MM/YY or MM/YYYY
}): CheckoutPreset | null {
  const digits = (input.cardNumber || "").replace(/\D+/g, "")
  if (digits.length < 4) return null
  const last4 = digits.slice(-4)

  const match = (input.expiration || "").match(/^(\d{1,2})\/(\d{2,4})$/)
  if (!match) return null
  const expMonth = Math.max(1, Math.min(12, Number(match[1])))
  const yearRaw = match[2]
  const expYear = yearRaw.length === 2 ? Number(`20${yearRaw}`) : Number(yearRaw)
  if (!Number.isFinite(expYear)) return null

  const brand = detectBrand(digits)

  const preset: CheckoutPreset = {
    id: `preset-${Date.now()}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    address: input.address.trim(),
    city: input.city?.trim(),
    country: input.country?.trim(),
    card: {
      brand,
      last4,
      expMonth,
      expYear,
      holderName: input.fullName.trim(),
    },
  }

  const existing = readLocalPresets(userId)
  const key = (p: CheckoutPreset) => `${p.fullName}-${p.email}-${p.address}-${p.city ?? ""}-${p.country ?? ""}-${p.card.last4}-${p.card.expMonth}-${p.card.expYear}`
  const exists = existing.some((p) => key(p) === key(preset))
  const next = exists ? existing : [preset, ...existing]
  writeLocalPresets(userId, next)
  return preset
}

export function formatPresetLabel(p: CheckoutPreset): string {
  const mm = String(p.card.expMonth).padStart(2, "0")
  const yy = String(p.card.expYear).slice(-2)
  return `${p.fullName} • ${p.email} — ${p.card.brand.toUpperCase()} •••• ${p.card.last4} — ${mm}/${yy}`
}
