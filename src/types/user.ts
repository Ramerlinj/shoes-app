export type UserRole = "user" | "admin"

export interface User {
  id?: string | number
  name?: string
  surname?: string
  firstName?: string
  lastName?: string
  email: string
  password?: string
  role?: UserRole
  createdAt?: string
  created_at?: string
  updated_at?: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegistrationPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}
