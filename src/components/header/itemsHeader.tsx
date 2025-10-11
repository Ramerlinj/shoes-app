"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

function ItemsHeader() {
  const { user } = useAuth()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-1 text-sm font-medium transition-all ${
      isActive
        ? "bg-dodger-blue-100 text-dodger-blue-900 shadow-sm"
        : "text-slate-500 hover:text-dodger-blue-800 hover:bg-dodger-blue-50"
    }`

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
        <li>
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={linkClass}>
            Sneakers
          </NavLink>
        </li>
        {user?.role === "admin" && (
          <li>
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/about" className={linkClass}>
            About us
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default ItemsHeader
