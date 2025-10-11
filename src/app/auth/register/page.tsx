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

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) {
      setError("Passwords must match")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)
    const result = await register({ ...form })
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message ?? "We couldn't create the account. Please try again.")
      return
    }

    navigate("/products")
  }

  const footer = (
    <p>
      Already have an account?{" "}
      <Link to="/login" className="font-semibold text-dodger-blue-900 hover:underline">
        Sign in
      </Link>
    </p>
  )

  return (
    <AuthLayout
      title="Create your account"
      description="Register to unlock Dominican-only releases and save your favorite pairs."
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
              First name
            </Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              placeholder="María"
              className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
              Last name
            </Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              placeholder="García"
              className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@email.com"
            autoComplete="email"
            className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Password
            </Label>
            <PasswordInput
              id="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
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
              value={form.confirmPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              placeholder="••••••••"
              minLength={6}
              autoComplete="new-password"
              className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
              required
            />
          </div>
        </div>

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
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
