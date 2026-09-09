import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Send, Store, Users, Wine, TrendingUp, BookOpen, Coins, Beaker, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

const VENUE_TYPES = ["Trattoria", "Vineria", "Beach club", "Hotel", "Locale serale", "Fine dining", "Pizzeria", "Agriturismo", "Cocktail bar", "Altro"];

export default function B2B() {
  const { t, user } = useApp();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: user?.email || "", venue: "", seats: "", budget: "", note: "" });
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSent(true); };

  const features = [
    { icon: Wine, title: t("b2b.feature.carta"), color: "bg-bordeaux-800", text: t("b2b.feature.carta.desc") },
    { icon: Users, title: t("b2b.feature.formazione"), color: "bg-gold-700", text: t("b2b.feature.formazione.desc") },
    { icon: TrendingUp, title: t("b2b.feature.vendita"), color: "bg-bordeaux-700", text: t("b2b.feature.vendita.desc") },
    { icon: BookOpen, title: t("b2b.feature.analisi"), color: "bg-gold-600", text: t("b2b.feature.analisi.desc") },
    { icon: Beaker, title: t("b2b.feature.lab"), color: "bg-bordeaux-600", text: t("b2b.feature.lab.desc") },
  ];

  const PLANS = [
    {
      name: t("b2b.plan.essenziale"), price: "49", tokens: "500 token/mese", desc: t("b2b.plan.essenziale.desc"),
      features: [
        { label: t("b2b.feature.carta"), detail: t("b2b.feature.carta.desc") },
        { label: t("b2b.feature.analisi"), detail: t("b2b.feature.analisi.desc") },
        { label: "10 " + t("restaurant.aiConsult"), detail: t("restaurant.aiPlaceholder") },
        { label: t("nav.winelab"), detail: t("b2b.feature.lab.desc") },
        { label: t("restaurant.aiRecommendations"), detail: t("restaurant.aiMenuAnalysis") },
      ],
    },
    {
      name: t("b2b.plan.professionale"), price: "99", tokens: "2000 token/mese", desc: t("b2b.plan.professionale.desc"),
      features: [
        { label: t("b2b.plan.essenziale"), detail: t("b2b.plan.essenziale.desc") },
        { label: t("b2b.feature.vendita"), detail: t("b2b.feature.vendita.desc") },
        { label: t("b2b.feature.formazione"), detail: t("b2b.feature.formazione.desc") },
        { label: t("b2b.feature.carta"), detail: t("b2b.feature.carta.desc") },
        { label: t("nav.winelab"), detail: t("b2b.feature.lab.desc") },
      ],
    },
    {
      name: t("b2b.plan.signature"), price: "199", tokens: "5000 token/mese", desc: t("b2b.plan.signature.desc"),
      features: [
        { label: t("b2b.plan.professionale"), detail: t("b2b.plan.professionale.desc") },
        { label: t("consulting.s1"), detail: t("consulting.s1.desc") },
        { label: t("consulting.s2"), detail: t("consulting.s2.desc") },
        { label: t("consulting.s3"), detail: t("consulting.s3.desc") },
        { label: t("nav.dashboard"), detail: t("restaurant.aiMenuAnalysis") },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="max-w-3xl mb-12">
        <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-3">{t("b2b.subtitle")}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-bordeaux-950">{t("b2b.title")}</h1>
        <p className="text-bordeaux-600 mt-4 text-lg">{t("b2b.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-14">
        {features.map((item) => (
          <div key={item.title} className="p-6 rounded-2xl bg-cream-100 border border-cream-200">
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
              <item.icon className="w-6 h-6 text-cream-50" />
            </div>
            <h2 className="font-serif text-xl text-bordeaux-950">{item.title}</h2>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mb-14 p-5 rounded-2xl bg-bordeaux-50 border border-bordeaux-200">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5 text-gold-600" />
          <h3 className="font-serif text-lg text-bordeaux-950">{t("b2b.token.title")}</h3>
        </div>
        <p className="text-sm text-bordeaux-600 leading-relaxed">{t("b2b.token.desc")}</p>
      </div>

      <div className="mb-14 p-6 rounded-2xl bg-gradient-to-br from-bordeaux-900 to-bordeaux-950 text-cream-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-gold-400 mb-1">{t("b2b.upsell.badge")}</p>
          <h3 className="font-serif text-xl text-cream-50">{t("b2b.upsell.title")}</h3>
          <p className="text-sm text-cream-300 mt-1">{t("b2b.upsell.desc")}</p>
        </div>
        <button onClick={() => navigate("/consulenza-privata")} className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors shrink-0">
          {t("b2b.upsell.cta")} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        <section className="p-6 md:p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <div className="flex items-center gap-3 mb-5"><Store className="w-6 h-6 text-gold-400" /><h2 className="font-serif text-2xl text-cream-50">{t("b2b.form.title")}</h2></div>
          {sent ? (
            <div className="py-10 text-center"><Check className="w-12 h-12 text-gold-400 mx-auto mb-4" /><h3 className="font-serif text-2xl text-cream-50">{t("b2b.form.sent")}</h3><p className="text-cream-300 mt-2">{t("b2b.form.sent.desc")}</p></div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder={t("b2b.form.name")} value={form.name} onChange={(e) => update("name", e.target.value)} className="px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                <input required type="email" placeholder={t("b2b.form.email")} value={form.email} onChange={(e) => update("email", e.target.value)} className="px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select required value={form.venue} onChange={(e) => update("venue", e.target.value)} className="px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-200 focus:outline-none focus:ring-2 focus:ring-gold-400"><option value="">{t("b2b.form.venue")}</option>{VENUE_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
                <input required type="number" min="1" placeholder={t("b2b.form.seats")} value={form.seats} onChange={(e) => update("seats", e.target.value)} className="px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className="w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-200 focus:outline-none focus:ring-2 focus:ring-gold-400"><option value="">{t("b2b.form.budget")}</option><option>Fino a 20€</option><option>20–40€</option><option>40–80€</option><option>Oltre 80€</option></select>
              <textarea required rows={4} placeholder={t("b2b.form.note")} value={form.note} onChange={(e) => update("note", e.target.value)} className="w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              <button type="submit" className="w-full py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2"><Send className="w-4 h-4" /> {t("b2b.form.submit")}</button>
            </form>
          )}
        </section>

        <section>
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-3">{t("b2b.plans.title")}</p>
          <h2 className="font-serif text-3xl text-bordeaux-950 mb-5">{t("b2b.plans.heading")}</h2>
          <div className="space-y-4">
            {PLANS.map((plan, index) => (
              <div key={plan.name} className={`p-5 rounded-xl border ${index === 1 ? "border-gold-400 bg-gradient-to-br from-gold-50 to-cream-50" : "border-cream-200 bg-cream-50"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-bordeaux-950">{plan.name}</h3>
                    <p className="text-xs text-bordeaux-600 mt-1">{plan.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <strong className="font-serif text-3xl text-bordeaux-950">€{plan.price}</strong>
                    <span className="text-xs text-bordeaux-500">{t("b2b.plan.month")}</span>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Coins className="w-3.5 h-3.5 text-gold-600" />
                      <span className="text-xs font-semibold text-gold-700">{plan.tokens}</span>
                    </div>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-bordeaux-800">{feature.label}</p>
                        <p className="text-xs text-bordeaux-500 mt-0.5">{feature.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-bordeaux-700 mt-4 font-medium">{t("b2b.plans.trial")}</p>
        </section>
      </div>
    </div>
  );
}
