"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthLayout } from "../_components/AuthLayout"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [stage, setStage] = useState<"request" | "reset">("request")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    // Simulate a successful email send; the reset step confirms the user
    setTimeout(() => {
      setIsSubmitting(false)
      setStage("reset")
      setSuccessMessage(
        "We verified your email. Create a new password to secure your account.",
      )
    }, 600)
  }

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("Passwords must match")
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)
    const result = await resetPassword(email, newPassword)
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message ?? "We couldn't update the password.")
      return
    }

    setSuccessMessage("Your password was updated successfully. Sign in to keep shopping.")
    setTimeout(() => navigate("/login"), 1200)
  }

  const footer = (
    <p>
      Remembered your password?{" "}
      <Link to="/login" className="font-semibold text-dodger-blue-900 hover:underline">
        Sign in
      </Link>
    </p>
  )

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email to restore access to your Zapatería account."
      footer={footer}
    >
      {stage === "request" ? (
        <form onSubmit={handleRequest} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
              required
            />
          </div>

          {successMessage && (
            <Alert>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-dodger-blue-900 text-base font-semibold text-white shadow-lg transition transform hover:-translate-y-0.5 hover:bg-dodger-blue-800 hover:shadow-xl disabled:translate-y-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending instructions..." : "Continue"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email-review" className="text-sm font-semibold text-gray-700">
              Email on file
            </Label>
            <Input id="email-review" value={email} readOnly className="h-12 rounded-xl border-transparent bg-gray-100 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">
              New password
            </Label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="••••••••"
              minLength={6}
              autoComplete="new-password"
              className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
              Confirm password
            </Label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              minLength={6}
              autoComplete="new-password"
              className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
              required
            />
          </div>

          {successMessage && (
            <Alert>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-dodger-blue-900 text-base font-semibold text-white shadow-lg transition transform hover:-translate-y-0.5 hover:bg-dodger-blue-800 hover:shadow-xl disabled:translate-y-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Update password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPasswordPage
