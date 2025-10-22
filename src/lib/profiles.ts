import { API_BASE_URL } from "./auth"

export interface CheckoutProfile {
  id: string | number
  fullName: string
  email: string
  address: string
  city?: string
  country?: string
  isDefault?: boolean
}

const LOCAL_PROFILES_KEY = (userId: string | number) => `zapateria_profiles_${userId}`

function readLocalProfiles(userId: string | number): CheckoutProfile[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(LOCAL_PROFILES_KEY(userId))
  if (!raw) return []
  try {
    const arr = JSON.parse(raw) as CheckoutProfile[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function writeLocalProfiles(userId: string | number, profiles: CheckoutProfile[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LOCAL_PROFILES_KEY(userId), JSON.stringify(profiles))
}

function parseProfileList(payload: unknown): CheckoutProfile[] {
  if (Array.isArray(payload)) return payload as CheckoutProfile[]
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data: unknown }).data
    if (Array.isArray(data)) return data as CheckoutProfile[]
  }
  throw new Error("Formato de respuesta inesperado al obtener perfiles de compra")
}

export async function fetchCheckoutProfiles(userId: string | number): Promise<CheckoutProfile[]> {
  // Try a few common endpoints then merge with local
  const candidates = [
    `${API_BASE_URL}/users/${userId}/profiles`,
    `${API_BASE_URL}/users/${userId}/addresses`,
  ]

  for (const url of candidates) {
    try {
      const response = await fetch(url, { headers: { "Content-Type": "application/json" } })
      if (!response.ok) {
        if (response.status === 404 || response.status === 405) continue
        const text = await response.text()
        throw new Error(text || "No se pudieron obtener los perfiles de compra")
      }
      const remote = parseProfileList(await response.json())
      const local = readLocalProfiles(userId)
      // de-dupe by fullName+email+address
      const key = (p: CheckoutProfile) => `${p.fullName}-${p.email}-${p.address}-${p.city ?? ""}-${p.country ?? ""}`
      const seen = new Set(remote.map(key))
      const merged = [...remote]
      for (const p of local) {
        const k = key(p)
        if (!seen.has(k)) merged.push(p)
      }
      return merged
    } catch {
      // try next candidate or fall back to local
      continue
    }
  }

  return readLocalProfiles(userId)
}

export function saveCheckoutProfileForUser(userId: string | number, input: Omit<CheckoutProfile, "id">): CheckoutProfile {
  const newProfile: CheckoutProfile = {
    id: `local-prof-${Date.now()}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    address: input.address.trim(),
    city: input.city?.trim(),
    country: input.country?.trim(),
    isDefault: Boolean(input.isDefault),
  }
  const existing = readLocalProfiles(userId)
  const key = (p: CheckoutProfile) => `${p.fullName}-${p.email}-${p.address}-${p.city ?? ""}-${p.country ?? ""}`
  const exists = existing.some((p) => key(p) === key(newProfile))
  const next = exists ? existing : [newProfile, ...existing]
  writeLocalProfiles(userId, next)
  return newProfile
}

export function deleteLocalCheckoutProfile(userId: string | number, profileId: string | number) {
  const existing = readLocalProfiles(userId)
  const next = existing.filter((p) => String(p.id) !== String(profileId))
  writeLocalProfiles(userId, next)
}
