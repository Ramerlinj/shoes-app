import { Link } from "react-router-dom"
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react"

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-100/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-5">
          <Link to="/" className="group inline-flex flex-col leading-none">
            <span className="text-xl font-semibold tracking-tight text-slate-900 transition group-hover:text-dodger-blue-700 md:text-2xl">
              Zapatería
            </span>
            <span className="mt-1 h-0.5 w-12 rounded-full bg-gradient-to-r from-dodger-blue-500 to-dodger-blue-300 transition group-hover:w-16" />
          </Link>
          <p className="max-w-sm text-sm text-slate-600">
            We blend premium materials with Caribbean innovation so every step feels light, confident, and full of style.
            Discover Santo Domingo exclusives and personal guidance tailored to island life.
          </p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition hover:-translate-y-0.5 hover:border-dodger-blue-400 hover:text-dodger-blue-600"
                aria-label={`Social network ${index + 1}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-5 text-sm">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Explore</h3>
          <ul className="space-y-2 text-slate-600">
            <li>
              <Link to="/products" className="transition hover:text-dodger-blue-700">
                New arrivals
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition hover:text-dodger-blue-700">
                Performance collection
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition hover:text-dodger-blue-700">
                Limited editions
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-5 text-sm">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Contact</h3>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-dodger-blue-600" />
              <span>Av. Winston Churchill 300, Santo Domingo, RD</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-dodger-blue-600" />
              <a href="tel:+18095550101" className="transition hover:text-dodger-blue-700">
                +1 809 555 0101
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-dodger-blue-600" />
              <a href="mailto:hello@zapateria.do" className="transition hover:text-dodger-blue-700">
                hello@zapateria.do
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white/90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Zapatería. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="transition hover:text-dodger-blue-700">
              Privacy
            </Link>
            <Link to="#" className="transition hover:text-dodger-blue-700">
              Terms
            </Link>
            <Link to="#" className="transition hover:text-dodger-blue-700">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
