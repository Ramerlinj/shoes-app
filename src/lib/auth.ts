import bcrypt from "bcryptjs"
import type { AuthCredentials, RegistrationPayload, User, UserRole } from "@/types/user"

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api"
const USERS_ENDPOINT = `${API_BASE_URL}/users`
const SESSION_STORAGE_KEY = "zapateria_active_user"

const isBrowser = typeof window !== "undefined"

function normalizeRole(value: unknown): UserRole {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (["admin", "administrator", "administrador", "adm"].includes(normalized)) {
      return "admin"
    }
  }

  if (typeof value === "number") {
    if (value === 1) return "admin"
  }

  if (typeof value === "boolean") {
    return value ? "admin" : "user"
  }

  return "user"
}

function normalizeUser(user: User): User {
  return {
    ...user,
    role: normalizeRole(user.role),
    email: user.email?.trim().toLowerCase() ?? user.email,
    name: user.name ?? user.firstName,
    surname: user.surname ?? user.lastName,
  }
}

function persistSession(user: User) {
  if (!isBrowser) return
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(normalizeUser(user)))
}

function clearSession() {
  if (!isBrowser) return
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

function readSession(): User | null {
  if (!isBrowser) return null
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null
  try {
  const stored = JSON.parse(raw) as User
  return normalizeUser(stored)
  } catch (error) {
    console.error("No se pudo leer la sesión almacenada", error)
    return null
  }
}

function parseUserList(payload: unknown): User[] {
  if (Array.isArray(payload)) {
  return (payload as User[]).map(normalizeUser)
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
  return (payload as { data: User[] }).data.map(normalizeUser)
  }

  throw new Error("Formato de respuesta inesperado al obtener usuarios")
}

function parseUser(payload: unknown): User {
  if (!payload) {
    throw new Error("Respuesta vacía del servidor")
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data: unknown }).data
  ) {
    return normalizeUser((payload as { data: User }).data)
  }
  return normalizeUser(payload as User)
  return payload as User
}

function normalizeHash(hash: string): string {
  if (hash.startsWith("$2y$")) {
    return "$2a$" + hash.slice(4)
  }
  return hash
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(USERS_ENDPOINT, {
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error("No se pudo obtener la lista de usuarios")
    }

    const data = await response.json()
    return parseUserList(data)
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el servidor de usuarios. Asegúrate de que la API esté en ejecución.",
      )
    }

    throw error instanceof Error
      ? error
      : new Error("No se pudo obtener la lista de usuarios por un error desconocido")
  }
}

export async function postUser(body: unknown): Promise<User> {
  const response = await fetch(USERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "No se pudo crear el usuario")
  }

  const data = await response.json()
  return parseUser(data)
}

export async function updateUser(userId: string | number, body: unknown): Promise<User> {
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "No se pudo actualizar el usuario")
  }

  const data = await response.json()
  return parseUser(data)
}

export async function deleteUser(userId: string | number): Promise<void> {
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "No se pudo eliminar el usuario")
  }
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
}

export async function registerUser(payload: RegistrationPayload): Promise<AuthResponse> {
  try {
    if (payload.password !== payload.confirmPassword) {
      return { success: false, message: "Las contraseñas no coinciden" }
    }

    const body = {
      name: payload.firstName.trim(),
      surname: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role: "user" as const,
    }

    const user = await postUser(body)
    persistSession(user)

    return { success: true, user }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No pudimos registrar tu cuenta. Intenta nuevamente.",
    }
  }
}

export async function authenticateUser(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const email = credentials.email.trim().toLowerCase()
    const users = await fetchUsers()
    const user = users.find((item) => item.email?.toLowerCase() === email)

    if (!user) {
      return { success: false, message: "Usuario no encontrado" }
    }

    const hashedPassword = user.password ? normalizeHash(user.password) : ""
    const passwordOk = await bcrypt.compare(credentials.password, hashedPassword)

    if (!passwordOk) {
      return { success: false, message: "Contraseña incorrecta" }
    }

    const normalizedUser = normalizeUser(user)
    persistSession(normalizedUser)
    return { success: true, user: normalizedUser }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No pudimos iniciar sesión. Intenta nuevamente.",
    }
  }
}

export function logoutUser(): void {
  clearSession()
}

export function getCurrentUser(): User | null {
  return readSession()
}

export async function updatePassword(email: string, newPassword: string): Promise<AuthResponse> {
  try {
    const users = await fetchUsers()
    const user = users.find((item) => item.email?.toLowerCase() === email.trim().toLowerCase())

    if (!user) {
      return { success: false, message: "No encontramos una cuenta con ese correo" }
    }

    if (user.id === undefined || user.id === null) {
      return {
        success: false,
        message: "El usuario no tiene un identificador válido para actualizarse",
      }
    }

    const updatedUser = await updateUser(user.id, {
      ...user,
      password: newPassword,
      role: user.role ?? "user",
    })

    persistSession(updatedUser)

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No pudimos actualizar la contraseña. Intenta nuevamente.",
    }
  }
}
