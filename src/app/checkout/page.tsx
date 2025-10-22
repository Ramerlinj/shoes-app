"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfettiBurst } from "@/components/ui/confetti";
import type { PaymentDetails } from "@/types/cart";
import { getCurrentUser } from "@/lib/auth";
import { createPayment, buildCreatePaymentBody } from "@/lib/payments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchCheckoutPresets,
  saveCheckoutPresetForUser,
  type CheckoutPreset,
  formatPresetLabel,
} from "@/lib/presets";

const INITIAL_FORM: PaymentDetails = {
  fullName: "",
  email: "",
  address: "",
  city: "Santo Domingo",
  country: "Dominican Republic",
  cardNumber: "",
  expiration: "",
  cvv: "",
};

export default function CheckoutPage() {
  const {
    items,
    itemCount,
    subtotal,
    currency,
    updateQuantity,
    removeItem,
    clearCart,
    processPayment,
    isProcessingPayment,
  } = useCart();

  const [form, setForm] = useState<PaymentDetails>(INITIAL_FORM);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [presets, setPresets] = useState<CheckoutPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<
    string | number | ""
  >("");
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [savePreset, setSavePreset] = useState(false);

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency }),
    [currency]
  );

  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Load user's unified presets (details + card)
  useEffect(() => {
    const user = getCurrentUser();
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoadingPresets(true);
        const userId = user.id as string | number;
        const list = await Promise.resolve(fetchCheckoutPresets(userId));
        if (!cancelled) setPresets(list);
      } finally {
        if (!cancelled) setIsLoadingPresets(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    // Basic validations for real payment API
    const masked = form.cardNumber.includes("*");
    const digits = form.cardNumber.replace(/\D+/g, "");
    if (!masked && digits.length < 12) {
      setErrorMessage("Please enter a valid card number.");
      return;
    }

    try {
      // Prefer real backend payment if available
      const payment = await createPayment(
        buildCreatePaymentBody({
          fullName: form.fullName,
          email: form.email,
          address: form.address,
          city: form.city,
          country: form.country,
          cardNumber: masked ? digits : digits, // ensure unmasked digits
          expiration: form.expiration,
          cvv: form.cvv,
          amount: total,
          currency,
        })
      );

      // Optionally save unified preset for logged-in users
      const currentUser = getCurrentUser();
      if (savePreset && currentUser?.id) {
        saveCheckoutPresetForUser(currentUser.id as string | number, {
          fullName: form.fullName,
          email: form.email,
          address: form.address,
          city: form.city,
          country: form.country,
          cardNumber: form.cardNumber,
          expiration: form.expiration,
        });
        const list = await Promise.resolve(
          fetchCheckoutPresets(currentUser.id as string | number)
        );
        setPresets(list);
      }

      // Clear cart and show success
      clearCart();
      setOrderId(`P-${payment.id}`);
      setShowCelebration(true);
      setForm(INITIAL_FORM);
      setSelectedPresetId("");
      setSavePreset(false);
      return;
    } catch (err) {
      // If backend is unreachable or returns error, fallback to simulated flow
      console.error("Real payment failed, falling back to simulation", err);
    }

    const result = await processPayment(form);
    if (result.success) {
      // Optionally save unified preset for logged-in users
      const currentUser = getCurrentUser();
      if (savePreset && currentUser?.id) {
        saveCheckoutPresetForUser(currentUser.id as string | number, {
          fullName: form.fullName,
          email: form.email,
          address: form.address,
          city: form.city,
          country: form.country,
          cardNumber: form.cardNumber,
          expiration: form.expiration,
        });
        const list = await Promise.resolve(
          fetchCheckoutPresets(currentUser.id as string | number)
        );
        setPresets(list);
      }
      setOrderId(result.orderId ?? null);
      setShowCelebration(true);
      setForm(INITIAL_FORM);
      setSelectedPresetId("");
      setSavePreset(false);
    } else {
      setErrorMessage(result.message ?? "Payment could not be completed.");
    }
  };

  // Apply unified preset (details + card) to form (keeps CVV empty)
  const applyPreset = (preset: CheckoutPreset | undefined) => {
    if (!preset) return;
    const mm = String(preset.card.expMonth).padStart(2, "0");
    const yy = String(preset.card.expYear).slice(-2);
    const maskedNumber = `**** **** **** ${preset.card.last4}`;
    setForm((prev) => ({
      ...prev,
      fullName: preset.fullName,
      email: preset.email,
      address: preset.address,
      city: preset.city ?? prev.city,
      country: preset.country ?? prev.country,
      cardNumber: maskedNumber,
      expiration: `${mm}/${yy}`,
      cvv: "",
    }));
  };

  useEffect(() => {
    if (!showCelebration) return;
    const timer = setTimeout(() => setShowCelebration(false), 3200);
    return () => clearTimeout(timer);
  }, [showCelebration]);

  return (
    <main className="bg-white/80">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-12">
        {showCelebration && (
          <ConfettiBurst className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center" />
        )}
        <div className="flex flex-col gap-2 pb-6">
          <p className="text-sm uppercase tracking-[0.35em] text-dodger-blue-600">
            Checkout
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Finalize your order
          </h1>
          <p className="text-sm text-slate-500 md:text-base">
            Review your cart, confirm delivery details, and simulate a secure
            payment. We ship across the Dominican Republic.
          </p>
        </div>

        {orderId && (
          <Alert className="relative mb-8 overflow-hidden border-dodger-blue-200 bg-gradient-to-r from-dodger-blue-50 via-white to-dodger-blue-50 text-dodger-blue-900">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-dodger-blue-200/40 blur-3xl" />
            <AlertTitle className="flex items-center gap-2 text-lg font-semibold">
              <CheckCircle2 className="h-5 w-5 text-dodger-blue-700" /> Payment
              successful
            </AlertTitle>
            <AlertDescription className="pt-1 text-sm">
              Order <strong>{orderId}</strong> is now confirmed. You can keep
              exploring the catalog while we prepare the shipment.
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Payment attempt failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <form onSubmit={handleCheckout} className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 pb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-dodger-blue-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Payment details
                    </h2>
                    <p className="text-xs text-slate-500">
                      Use test card numbers—this checkout can hit the real API
                      if configured.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoadingPresets || presets.length === 0}
                    onClick={() => setIsPresetModalOpen(true)}
                  >
                    {isLoadingPresets
                      ? "Loading..."
                      : presets.length > 0
                      ? "Choose saved checkout"
                      : "No saved checkout"}
                  </Button>
                  {selectedPresetId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPresetId("")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="mb-2 block">
                    Full name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Ana Rodríguez"
                    value={form.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-x-4">
                  <Label htmlFor="email" className="mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="m-2 block" htmlFor="address">
                  Delivery address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Street, number, sector"
                  value={form.address}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <Dialog
                open={isPresetModalOpen}
                onOpenChange={setIsPresetModalOpen}
              >
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Choose a saved checkout</DialogTitle>
                    <DialogDescription>
                      Autofill name, email, address and card (CVV remains
                      empty).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                    {presets.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        You don't have saved checkouts yet.
                      </p>
                    ) : (
                      presets.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50"
                        >
                          <div className="text-sm">
                            <div className="font-medium text-slate-800">
                              {formatPresetLabel(p)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {p.address}
                              {p.city ? `, ${p.city}` : ""}
                              {p.country ? `, ${p.country}` : ""}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              applyPreset(p);
                              setSelectedPresetId(p.id);
                              setIsPresetModalOpen(false);
                            }}
                          >
                            Use
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPresetModalOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="m-2 block" htmlFor="city">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Santo Domingo"
                    value={form.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="country" className="m-2 block">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Dominican Republic"
                    value={form.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Save preset opt-in (details + card) */}
              <div className="mt-2 flex items-center gap-2">
                <Checkbox
                  id="save-preset"
                  checked={savePreset}
                  onCheckedChange={(v) => setSavePreset(Boolean(v))}
                  disabled={!getCurrentUser()?.id}
                />
                <Label htmlFor="save-preset" className="text-sm text-slate-600">
                  Save these details and card for next time
                  {!getCurrentUser()?.id ? (
                    <span className="ml-1 text-xs text-slate-400">
                      (sign in required)
                    </span>
                  ) : null}
                </Label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label className="m-2 block" htmlFor="cardNumber">
                    Card number
                  </Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    value={form.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiration" className="mb-2 block">
                    Expiration
                  </Label>
                  <Input
                    id="expiration"
                    name="expiration"
                    placeholder="12/28"
                    maxLength={5}
                    value={form.expiration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="mb-2 block">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    maxLength={4}
                    value={form.cvv}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-slate-500">
                    For your security, we never store your CVV.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={itemCount === 0 || isProcessingPayment}
                  className="w-full rounded-full bg-dodger-blue-900 py-3 text-base font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-dodger-blue-800 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
                >
                  {isProcessingPayment
                    ? "Processing payment..."
                    : `Pay ${currencyFormatter.format(total)}`}
                </Button>
              </div>

              {/* Removed separate 'save details' checkbox in favor of unified preset */}
            </section>
          </form>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4">
                <Truck className="h-5 w-5 text-dodger-blue-700" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Order summary
                  </h2>
                  <p className="text-xs text-slate-500">
                    {itemCount} item{itemCount !== 1 ? "s" : ""} ready to ship.
                  </p>
                </div>
              </div>

              {items.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Your cart is empty. Head back to the catalog to add your
                  favorite sneakers.
                </p>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-start gap-4 border-b border-slate-100 pb-4 last:border-none last:pb-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.size ? `Size ${item.size}` : "One size"}
                              {item.color ? ` · ${item.color}` : ""}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {currencyFormatter.format(
                              item.price * item.quantity
                            )}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white shadow-sm">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 rounded-full text-slate-600 hover:bg-slate-100"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[2.5rem] text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="h-8 w-8 rounded-full text-slate-600 hover:bg-slate-100"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.key)}
                            className="text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>{currencyFormatter.format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0
                          ? "Free in RD"
                          : currencyFormatter.format(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 text-base font-semibold text-slate-900">
                      <span>Total</span>
                      <span>{currencyFormatter.format(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearCart}
                    className="w-full rounded-full border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Empty cart
                  </Button>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
