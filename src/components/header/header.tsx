
import { Link } from "react-router-dom"
import ItemsHeader from "./itemsHeader"
import { Button } from "@/components/ui/button"
import { CircleUserRound, LogOut, ChevronDown, ShoppingBag } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/hooks/useCart"

function resolveDisplayName(name?: string | null, fallback?: string) {
    if (!name || name.trim().length === 0) {
        return fallback ?? ""
    }
    return name.trim()
}

function getUserInitials(fullName: string) {
    if (!fullName) return "?"
    const pieces = fullName
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2)
    return pieces || "?"
}

function Header() {
    const { user, logout, loading } = useAuth()
    const { itemCount, subtotal, currency } = useCart()

    const primaryName = resolveDisplayName(user?.name ?? user?.firstName, user?.email?.split("@")[0])
    const secondaryName = resolveDisplayName(user?.surname ?? user?.lastName)
    const fullName = [primaryName, secondaryName].filter(Boolean).join(" ").trim()
    const initials = getUserInitials(fullName.length > 0 ? fullName : primaryName)
    const formattedSubtotal = itemCount > 0
        ? new Intl.NumberFormat("en-US", { style: "currency", currency }).format(subtotal)
        : null

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto w-full max-w-6xl px-4">
                <div className="flex h-20 items-center gap-6">
                    <div className="flex flex-1 items-center justify-start">
                        <Link to="/" className="group inline-flex flex-col leading-none">
                            <span className="text-2xl font-semibold tracking-tight text-slate-900 transition group-hover:text-dodger-blue-700 md:text-3xl">
                                Zapatería
                            </span>
                            <span className="mt-1 h-0.5 w-12 rounded-full bg-gradient-to-r from-dodger-blue-500 to-dodger-blue-300 transition group-hover:w-16" />
                        </Link>
                    </div>

                    <div className="hidden flex-1 justify-center md:flex">
                        <ItemsHeader />
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="relative rounded-full border-slate-200 bg-white/80 px-3 py-2 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-dodger-blue-300 hover:shadow-md"
                        >
                            <Link to="/checkout" className="flex items-center gap-2">
                                <span className="relative inline-flex">
                                    <ShoppingBag className="h-4 w-4" />
                                    {itemCount > 0 && (
                                        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-dodger-blue-600 px-1 text-xs font-semibold text-white">
                                            {itemCount}
                                        </span>
                                    )}
                                </span>
                                <span className="text-sm font-semibold">Cart</span>
                                {formattedSubtotal && (
                                    <span className="hidden text-xs font-medium text-slate-500 sm:inline">
                                        {formattedSubtotal}
                                    </span>
                                )}
                            </Link>
                        </Button>

                        {loading ? (
                            <Skeleton className="h-10 w-32 rounded-full" />
                        ) : user ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dodger-blue-400">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-dodger-blue-600 to-dodger-blue-800 font-semibold text-white shadow-md">
                                            {initials}
                                        </span>
                                        <div className="hidden text-left md:block">
                                            <p className="text-sm font-semibold text-slate-900">Hi, {primaryName || "friend"}</p>
                                            <p className="text-xs text-slate-500">Your account & orders</p>
                                        </div>
                                        <ChevronDown className="hidden h-4 w-4 text-slate-400 transition group-hover:text-dodger-blue-600 md:block" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-5">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-dodger-blue-600 to-dodger-blue-800 text-base font-semibold text-white shadow-lg">
                                            {initials}
                                        </span>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-slate-900">{fullName || primaryName || "Your account"}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-3 text-sm text-slate-600">
                                        <p className="rounded-lg bg-slate-100/70 px-3 py-2 text-xs font-medium text-slate-500">
                                            Enjoy island-exclusive drops and stay tuned for fresh releases.
                                        </p>
                                        <Link
                                            to="/products"
                                            className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-dodger-blue-300 hover:bg-dodger-blue-50"
                                        >
                                            Browse catalog
                                            <ShoppingBag className="h-4 w-4" />
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                            onClick={logout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign out
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Button
                                asChild
                                className="rounded-full bg-dodger-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-dodger-blue-700 hover:shadow-lg"
                            >
                                <Link to="/login" className="flex items-center gap-2">
                                    <CircleUserRound className="h-4 w-4" />
                                    <span>Sign in</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200 bg-white py-2 md:hidden">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <ItemsHeader />
                </div>
            </div>
        </header>
    )
}

export default Header