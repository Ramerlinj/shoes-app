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

function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, user } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const result = await login({ email: form.email, password: form.password })
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message ?? "We couldn't sign you in. Please try again.")
      return
    }

    navigate("/products")
  }

  const footer = (
    <div className="space-y-2">
      <p>
        Don't have an account? {" "}
        <Link to="/register" className="font-semibold text-dodger-blue-900 hover:underline">
          Join Zapatería
        </Link>
      </p>
      <p>
        Forgot your password? {" "}
        <Link to="/forgot-password" className="font-semibold text-dodger-blue-900 hover:underline">
          Reset it here
        </Link>
      </p>
    </div>
  )

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse rounded-full border-4 border-dodger-blue-200 border-t-dodger-blue-900 p-6" />
      </div>
    )
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to keep shopping, track deliveries, and access Dominican exclusives."
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            autoComplete="email"
            className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
            Password
          </Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            minLength={6}
            autoComplete="current-password"
            className="h-12 rounded-xl border-slate-200 bg-white/80 text-base shadow-sm transition focus:border-dodger-blue-400 focus-visible:ring-2 focus-visible:ring-dodger-blue-500/60"
            required
          />
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
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
