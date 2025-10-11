import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./app/home/page"
import ProductsPage from "./app/products/page"
import LoginPage from "./app/auth/login/page"
import RegisterPage from "./app/auth/register/page"
import ForgotPasswordPage from "./app/auth/forgot-password/page"
import AdminPage from "./app/admin/page"
import CheckoutPage from "./app/checkout/page"
import Header from "./components/header/header"
import Footer from "./components/footer/footer"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { Toaster } from "@/components/ui/sonner"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
          <Toaster position="top-right" richColors closeButton />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
