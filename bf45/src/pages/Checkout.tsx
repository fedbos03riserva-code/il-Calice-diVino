import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Checkout() {
  const { t, cart, cartTotal } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<"shipping" | "payment" | "confirm" | "success">("shipping");
  const [form, setForm] = useState({
    name: "", address: "", city: "", zip: "",
    card: "", expiry: "", cvc: "",
  });

  if (cart.length === 0 && step !== "success") {
    navigate("/cart");
    return null;
  }

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const steps = [
    { id: "shipping", label: t("checkout.shipping"), icon: Truck },
    { id: "payment", label: t("checkout.payment"), icon: CreditCard },
    { id: "confirm", label: t("checkout.confirm"), icon: ShieldCheck },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);
  if (stepIndex === -1 && step !== "success") return null;

  const handleShippingNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };
  const handlePaymentNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirm");
  };

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-bordeaux-950 mb-2">{t("checkout.success")}</h1>
        <p className="text-bordeaux-600 mb-8">{t("checkout.success.desc")}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors"
        >
          {t("checkout.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-serif text-3xl text-bordeaux-950 mb-2">{t("checkout.title")}</h1>
      <p className="text-xs text-bordeaux-500 mb-8 flex items-center gap-1">
        <ShieldCheck className="w-3 h-3" />
        {t("checkout.demo")}
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i <= stepIndex ? "bg-bordeaux-800 text-cream-50" : "bg-cream-200 text-bordeaux-400"
              }`}
            >
              {i + 1}
            </div>
            <span className={`ml-2 text-xs ${i <= stepIndex ? "text-bordeaux-950 font-medium" : "text-bordeaux-400"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < stepIndex ? "bg-bordeaux-800" : "bg-cream-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Shipping */}
      {step === "shipping" && (
        <form onSubmit={handleShippingNext} className="space-y-4 animate-fade-in">
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.name")}</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.address")}</label>
            <input
              type="text" required value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.city")}</label>
              <input
                type="text" required value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.zip")}</label>
              <input
                type="text" required value={form.zip}
                onChange={(e) => update("zip", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors">
            {t("checkout.payment")}
          </button>
        </form>
      )}

      {/* Payment */}
      {step === "payment" && (
        <form onSubmit={handlePaymentNext} className="space-y-4 animate-fade-in">
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.card")}</label>
            <input
              type="text" required maxLength={19} placeholder="4242 4242 4242 4242"
              value={form.card}
              onChange={(e) => update("card", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.expiry")}</label>
              <input
                type="text" required placeholder="MM/YY" maxLength={5}
                value={form.expiry}
                onChange={(e) => update("expiry", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("checkout.cvc")}</label>
              <input
                type="text" required placeholder="123" maxLength={4}
                value={form.cvc}
                onChange={(e) => update("cvc", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep("shipping")}
              className="px-4 py-3 rounded-lg bg-cream-100 text-bordeaux-700 hover:bg-cream-200 transition-colors text-sm">
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
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-6 mb-4">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-3">{t("checkout.shipping")}</h3>
            <p className="text-sm text-bordeaux-600">{form.name}</p>
            <p className="text-sm text-bordeaux-600">{form.address}, {form.city} {form.zip}</p>
          </div>
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-6 mb-4">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-3">{t("checkout.payment")}</h3>
            <p className="text-sm text-bordeaux-600">
              {t("checkout.card")}: ****{form.card.slice(-4)}
            </p>
          </div>
          <div className="bg-cream-100 rounded-xl border border-cream-200 p-6 mb-4">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg text-bordeaux-950">{t("cart.total")}</span>
              <span className="font-serif text-2xl font-bold text-bordeaux-950 tabular-nums">&euro;{cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("payment")}
              className="px-4 py-3 rounded-lg bg-cream-100 text-bordeaux-700 hover:bg-cream-200 transition-colors text-sm">
              &larr; {t("checkout.payment")}
            </button>
            <button
              onClick={() => setStep("success")}
              className="flex-1 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors"
            >
              {t("checkout.place")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
