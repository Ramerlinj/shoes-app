import { createContext } from "react"
import type { AuthCredentials, RegistrationPayload, User } from "@/types/user"
import type { AuthResponse } from "@/lib/auth"

export interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (credentials: AuthCredentials) => Promise<AuthResponse>
  register: (payload: RegistrationPayload) => Promise<AuthResponse>
  logout: () => void
  resetPassword: (email: string, newPassword: string) => Promise<AuthResponse>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
