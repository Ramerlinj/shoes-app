import type { ReactNode } from "react"
import { CheckCircle2, Sparkles } from "lucide-react"

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  const highlights = [
    "Weekly drops curated for the Dominican Republic",
    "Order history and delivery tracking in one place",
    "Personalized offers for your Caribbean lifestyle",
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200 py-12 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,144,255,0.18),_transparent_55%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-2xl backdrop-blur-md md:flex-row md:p-10">
        <section className="relative flex flex-1 flex-col justify-between gap-8 overflow-hidden rounded-2xl bg-dodger-blue-900 px-8 py-10 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium tracking-wide">
              <Sparkles className="h-4 w-4" /> Zapatería Premium Club
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-[42px]">{title}</h1>
              <p className="text-base text-white/80 md:text-lg">{description}</p>
            </div>
            <div className="space-y-3 pt-4">
              {highlights.map((highlight) => (
                <div key={highlight} className="flex items-start gap-3 text-sm text-white/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-white" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-white/60">
            <span>Adidas</span>
            <span>Nike</span>
            <span>Puma</span>
            <span>Converse</span>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-xl">
            {children}
            {footer && (
              <div className="border-t border-slate-200 pt-4 text-center text-sm text-gray-500">
                {footer}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
