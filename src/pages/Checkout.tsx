import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, Truck, ShieldCheck, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

const COUNTRIES = ["Italia", "France", "España", "Deutschland", "United Kingdom", "USA", "Canada", "Australia"];

function detectCardType(cardNumber: string): string {
  const num = cardNumber.replace(/\s/g, "");
  if (num.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  if (/^6/.test(num)) return "discover";
  return "card";
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  if (digits.length >= 2) return `${digits}/`;
  return digits;
}

function luhnValid(cardNumber: string): boolean {
  const num = cardNumber.replace(/\s/g, "");
  if (num.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

const cardTypeLabels: Record<string, string> = {
  visa: "VISA", mastercard: "MASTERCARD", amex: "AMEX", discover: "DISCOVER", card: "CARD",
};

export default function Checkout() {
  const { t, cart, cartTotal, clearCart, addOrder, user } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<"shipping" | "payment" | "confirm" | "success">("shipping");
  const [form, setForm] = useState({
    name: user?.nome || "", email: user?.email || "", address: "", city: "", zip: "", country: "",
    cardName: "", card: "", expiry: "", cvc: "",
  });
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderInfo, setOrderInfo] = useState<{ number: string; email: string } | null>(null);

  if (cart.length === 0 && step !== "success") {
    navigate("/cart");
    return null;
  }

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const shipping = cartTotal >= 100 ? 0 : 9.9;
  const vatRate = 0.22;
  const vat = (cartTotal + shipping) * vatRate;
  const grandTotal = cartTotal + shipping + vat;

  const steps = [
    { id: "shipping", label: t("checkout.shipping"), icon: Truck },
    { id: "payment", label: t("checkout.payment"), icon: CreditCard },
    { id: "confirm", label: t("checkout.confirm"), icon: ShieldCheck },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);
  if (stepIndex === -1 && step !== "success") return null;

  const validateShipping = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("checkout.name");
    if (!form.address.trim()) e.address = t("checkout.address");
    if (!form.city.trim()) e.city = t("checkout.city");
    if (!form.zip.trim() || form.zip.length < 4) e.zip = t("checkout.invalidZip");
    if (!form.country) e.country = t("checkout.selectCountry");
    if (!form.email.trim() || !form.email.includes("@")) e.email = t("account.email");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.cardName.trim()) e.cardName = t("checkout.cardName");
    if (!luhnValid(form.card)) e.card = t("checkout.invalidCard");
    const [mm, yy] = form.expiry.split("/");
    if (!mm || !yy || parseInt(mm) < 1 || parseInt(mm) > 12) e.expiry = t("checkout.invalidExpiry");
    if (form.cvc.length < 3) e.cvc = t("checkout.invalidCvc");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleShippingNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) setStep("payment");
  };

  const handlePaymentNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) setStep("confirm");
  };

  const handlePlaceOrder = () => {
    if (!ageConfirmed) return;
    const order = addOrder({
      items: [...cart],
      total: grandTotal,
      shipping,
      vat,
      customerName: form.name,
      email: form.email,
      address: form.address,
      city: form.city,
      zip: form.zip,
      country: form.country,
    });
    setOrderInfo({ number: order.number, email: form.email });
    clearCart();
    setStep("success");
  };

  if (step === "success" && orderInfo) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-bordeaux-950 mb-2">{t("checkout.success")}</h1>
        <p className="text-bordeaux-600 mb-2">{t("checkout.success.desc")}</p>
        <div className="my-6 p-4 rounded-xl bg-cream-100 border border-cream-200">
          <p className="text-xs text-bordeaux-500 mb-1">{t("checkout.orderNumber")}</p>
          <p className="font-serif text-xl font-bold text-bordeaux-950 tracking-wider">{orderInfo.number}</p>
        </div>
        <div className="mb-8 p-4 rounded-xl bg-cream-50 border border-cream-200 text-left">
          <p className="text-xs text-bordeaux-500 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> {t("checkout.confirmationEmail")}
          </p>
          <p className="text-sm text-bordeaux-700">{t("checkout.confirmationEmailDesc")} <span className="font-medium text-bordeaux-950">{orderInfo.email}</span></p>
        </div>
        <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
          {t("checkout.back")}
        </button>
      </div>
    );
  }

  const cardType = detectCardType(form.card);
  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-cream-50 border text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400";
  const errorBorder = (field: string) => errors[field] ? "border-red-400" : "border-cream-300";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-serif text-3xl text-bordeaux-950 mb-2">{t("checkout.title")}</h1>
      <p className="text-xs text-bordeaux-500 mb-8 flex items-center gap-1">
        <ShieldCheck className="w-3 h-3" /> {t("checkout.demo")}
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${i <= stepIndex ? "bg-bordeaux-800 text-cream-50" : "bg-cream-200 text-bordeaux-400"}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-xs ${i <= stepIndex ? "text-bordeaux-950 font-medium" : "text-bordeaux-400"}`}>{s.label}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < stepIndex ? "bg-bordeaux-800" : "bg-cream-200"}`} />}
          </div>
        ))}
      </div>

      {/* Shipping */}
      {step === "shipping" && (
        <form onSubmit={handleShippingNext} className="space-y-4 animate-fade-in">
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.name")}</label>
            <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={`${inputClass} ${errorBorder("name")}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("account.email")}</label>
            <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={`${inputClass} ${errorBorder("email")}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.address")}</label>
            <input type="text" required value={form.address} onChange={(e) => update("address", e.target.value)} className={`${inputClass} ${errorBorder("address")}`} />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.city")}</label>
              <input type="text" required value={form.city} onChange={(e) => update("city", e.target.value)} className={`${inputClass} ${errorBorder("city")}`} />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.zip")}</label>
              <input type="text" required value={form.zip} onChange={(e) => update("zip", e.target.value)} className={`${inputClass} ${errorBorder("zip")}`} />
              {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
            </div>
          </div>
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.country")}</label>
            <select value={form.country} onChange={(e) => update("country", e.target.value)} className={`${inputClass} ${errorBorder("country")}`}>
              <option value="">{t("checkout.selectCountry")}</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors">
            {t("checkout.payment")}
          </button>
        </form>
      )}

      {/* Payment */}
      {step === "payment" && (
        <form onSubmit={handlePaymentNext} className="space-y-4 animate-fade-in">
          {/* Card preview */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-bordeaux-800 to-bordeaux-950 text-cream-50 mb-2">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-6 h-6 text-gold-400" />
              <span className="text-xs font-bold tracking-wider text-gold-400">{cardTypeLabels[cardType]}</span>
            </div>
            <p className="font-mono text-lg tracking-wider mb-3">{form.card || "•••• •••• •••• ••••"}</p>
            <div className="flex justify-between text-xs text-cream-300">
              <span>{form.cardName || t("checkout.cardName")}</span>
              <span>{form.expiry || "MM/YY"}</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.cardName")}</label>
            <input type="text" required value={form.cardName} onChange={(e) => update("cardName", e.target.value)} className={`${inputClass} ${errorBorder("cardName")}`} />
            {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
          </div>
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.card")}</label>
            <input
              type="text" required maxLength={19} placeholder="4242 4242 4242 4242"
              value={form.card}
              onChange={(e) => update("card", formatCardNumber(e.target.value))}
              className={`${inputClass} ${errorBorder("card")}`}
            />
            {errors.card && <p className="text-xs text-red-500 mt-1">{errors.card}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.expiry")}</label>
              <input type="text" required placeholder="MM/YY" maxLength={5} value={form.expiry}
                onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                className={`${inputClass} ${errorBorder("expiry")}`}
              />
              {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
            </div>
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.cvc")}</label>
              <input type="text" required placeholder="123" maxLength={4} value={form.cvc}
                onChange={(e) => update("cvc", e.target.value.replace(/\D/g, ""))}
                className={`${inputClass} ${errorBorder("cvc")}`}
              />
              {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep("shipping")} className="px-4 py-3 rounded-lg bg-cream-100 text-bordeaux-700 hover:bg-cream-200 transition-colors text-sm">
              &larr; {t("checkout.shipping")}
            </button>
            <button type="submit" className="flex-1 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors">
              {t("checkout.confirm")}
            </button>
          </div>
        </form>
      )}

      {/* Confirm */}
      {step === "confirm" && (
        <div className="animate-fade-in">
          {/* Order summary */}
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-6 mb-4">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-3">{t("checkout.shipping")}</h3>
            <p className="text-sm text-bordeaux-600">{form.name}</p>
            <p className="text-sm text-bordeaux-600">{form.email}</p>
            <p className="text-sm text-bordeaux-600">{form.address}, {form.city} {form.zip}</p>
            <p className="text-sm text-bordeaux-600">{form.country}</p>
          </div>
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-6 mb-4">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-3">{t("checkout.payment")}</h3>
            <p className="text-sm text-bordeaux-600">{cardTypeLabels[cardType]} ****{form.card.replace(/\s/g, "").slice(-4)}</p>
            <p className="text-sm text-bordeaux-600">{form.cardName}</p>
          </div>

          {/* Cost breakdown */}
          <div className="bg-cream-100 rounded-xl border border-cream-200 p-6 mb-4 space-y-2">
            <div className="flex justify-between text-sm text-bordeaux-600">
              <span>{t("checkout.subtotal")}</span>
              <span className="tabular-nums">&euro;{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-bordeaux-600">
              <span>{t("checkout.shippingCost")}</span>
              <span className="tabular-nums">{shipping === 0 ? t("checkout.freeShipping") : `&euro;${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm text-bordeaux-600">
              <span>{t("checkout.vat")}</span>
              <span className="tabular-nums">&euro;{vat.toFixed(2)}</span>
            </div>
            <div className="border-t border-cream-300 pt-2 flex justify-between">
              <span className="font-serif text-lg text-bordeaux-950">{t("checkout.grandTotal")}</span>
              <span className="font-serif text-2xl font-bold text-bordeaux-950 tabular-nums">&euro;{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Age confirmation */}
          <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer mb-4 transition-colors ${ageConfirmed ? "border-green-400 bg-green-50" : "border-cream-300 bg-cream-50"}`}>
            <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} className="mt-0.5 w-5 h-5 accent-bordeaux-800" />
            <span className="text-sm text-bordeaux-700">{t("checkout.ageConfirm")}</span>
          </label>
          {!ageConfirmed && (
            <p className="text-xs text-bordeaux-400 mb-4 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {t("checkout.ageRequired")}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep("payment")} className="px-4 py-3 rounded-lg bg-cream-100 text-bordeaux-700 hover:bg-cream-200 transition-colors text-sm">
              &larr; {t("checkout.payment")}
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={!ageConfirmed}
              className="flex-1 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("checkout.place")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
