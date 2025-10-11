"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  authenticateUser,
  getCurrentUser,
  logoutUser,
  registerUser,
  updatePassword,
} from "@/lib/auth"
import { AuthContext, type AuthContextValue } from "./auth-context"
import type { AuthCredentials, RegistrationPayload, User } from "@/types/user"
import { toast } from "sonner"

function getDisplayName(user: User | null): string {
  if (!user) return ""
  const primary = user.name ?? user.firstName ?? ""
  const secondary = user.surname ?? user.lastName ?? ""
  const composed = `${primary} ${secondary}`.trim()
  if (composed.length > 0) return composed
  if (user.email) {
    const [username] = user.email.split("@")
    return username ?? ""
  }
  return ""
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const existing = getCurrentUser()
    setUser(existing)
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials: AuthCredentials) => {
    const result = await authenticateUser(credentials)
    if (result.success && result.user) {
      setUser(result.user)
      const name = getDisplayName(result.user)
      toast.success(name ? `Welcome back, ${name}!` : "Signed in", {
        description: "Your Dominican sneaker hub is ready for new drops.",
      })
    } else {
      toast.error(result.message ?? "We couldn't sign you in. Please try again.")
    }
    return result
  }, [])

  const register = useCallback(async (payload: RegistrationPayload) => {
    const result = await registerUser(payload)
    if (result.success && result.user) {
      setUser(result.user)
      const name = getDisplayName(result.user)
      toast.success("Account created successfully", {
        description: name
          ? `${name}, welcome to the Zapatería family.`
          : "Your account is ready to unlock island-only perks.",
      })
    } else {
      toast.error(result.message ?? "We couldn't create your account. Please try again.")
    }
    return result
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
    toast.info("Signed out", {
      description: "Come back soon for the latest from Santo Domingo.",
    })
  }, [])

  const resetPassword = useCallback(async (email: string, newPassword: string) => {
    const result = await updatePassword(email, newPassword)
    if (result.success && result.user) {
      setUser(result.user)
      toast.success("Password updated", {
        description: "You can sign in again with your new credentials.",
      })
    } else {
      toast.error(result.message ?? "We couldn't update the password.")
    }
    return result
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, resetPassword }),
    [user, loading, login, register, logout, resetPassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
