import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Send, Store, Users, Wine, TrendingUp, BookOpen, Coins, Beaker, ArrowRight, ChefHat, Search, Briefcase, Share2, QrCode } from "lucide-react";
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

  const businessTools = [
    { icon: Search, title: "Abbinamenti Business", desc: "Analisi molecolare con prezzo in carta, margine target e temperatura di servizio per ogni abbinamento", to: "/abbinamenti", cta: "Prova ora" },
    { icon: Beaker, title: "Wine Lab Business", desc: "Laboratorio di abbinamento con slider professionali: prezzo in carta, margine e consigli per la sala in tempo reale", to: "/wine-lab", cta: "Apri Wine Lab" },
    { icon: ChefHat, title: "Consigli Culinari Business", desc: "Consigli operativi per la sala: posizionamento nel menu, abbinamenti multipli, strategie di upselling", to: "/reverse", cta: "Esplora" },
    { icon: Wine, title: "Carta Vini AI", desc: "Costruisci la carta dei vini completa del ristorante in 30 secondi con margine target regolabile", to: "/carta-ai", cta: "Crea carta" },
    { icon: Store, title: "Dashboard Ristorante", desc: "Gestisci la tua carta vini: stock, salute della carta, alert automatici e suggerimenti AI", to: "/dashboard", cta: "Apri dashboard" },
    { icon: QrCode, title: "Menu QR con AI", desc: "Crea il menu del tuo locale con abbinamenti AI generati automaticamente per ogni piatto", to: "/qr-menu", cta: "Crea menu QR" },
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

      {/* Business tools section */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-6 h-6 text-gold-600" />
          <h2 className="font-serif text-3xl text-bordeaux-950">Strumenti Business</h2>
        </div>
        <p className="text-sm text-bordeaux-600 mb-6 max-w-2xl">Tutti gli strumenti BF45 in modalita Business: ogni risultato include prezzo di vendita in carta, margine target, temperatura di servizio e consigli operativi per la sala.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {businessTools.map((tool, i) => (
            <button key={i} onClick={() => navigate(tool.to)} className="text-left p-6 rounded-2xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-bordeaux-800 flex items-center justify-center shrink-0">
                  <tool.icon className="w-6 h-6 text-gold-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-bordeaux-950 mb-1">{tool.title}</h3>
                  <p className="text-sm text-bordeaux-600 leading-relaxed">{tool.desc}</p>
                  <span className="flex items-center gap-1 text-xs text-gold-600 mt-3 group-hover:text-gold-700 font-medium">{tool.cta} <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommend platform */}
      <div className="mb-14 p-6 rounded-2xl bg-gradient-to-br from-bordeaux-900 to-bordeaux-950 text-cream-100">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif text-xl text-cream-50">Consiglia BF45</h3>
        </div>
        <p className="text-sm text-cream-200 mb-4 leading-relaxed">Hai trovato utile BF45? Aiutaci a far conoscere i vini dell'Oltrepò Pavese nel mondo. Condividi con un collega, un ristoratore o un buyer estero.</p>
        <div className="flex flex-wrap gap-3">
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A66C2] text-white font-semibold hover:bg-[#004182] transition-colors text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
            LinkedIn
          </a>
          <a href={`https://wa.me/?text=${encodeURIComponent("Scopri i vini dell'Oltrepò Pavese con BF45: " + window.location.origin)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#1da851] transition-colors text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.13c-.24.68-1.42 1.31-1.95 1.36-.5.05-.97.24-3.27-.68-2.76-1.09-4.5-3.93-4.64-4.12-.14-.19-1.12-1.49-1.12-2.84 0-1.35.71-2.02.96-2.3.24-.28.53-.35.71-.35.18 0 .35.01.51.01.16 0 .39-.06.6.46.24.58.82 2.01.89 2.16.07.14.12.31.02.5-.1.19-.16.31-.31.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.28.77 1.27 1.65 2.06 1.14 1.01 2.1 1.33 2.38 1.48.28.14.44.12.6-.07.17-.19.69-.81.88-1.09.19-.28.38-.23.64-.14.26.09 1.63.77 1.91.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z"/></svg>
            WhatsApp
          </a>
          <a href={`mailto:?subject=${encodeURIComponent("BF45 - I vini dell'Oltrepò Pavese")}&body=${encodeURIComponent("Ho trovato questa piattaforma che abbinamento i vini dell'Oltrepò Pavese con l'AI. Vale la pena guardarla: " + window.location.origin)}`} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bordeaux-700 text-cream-50 font-semibold hover:bg-bordeaux-600 transition-colors text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
            Email
          </a>
        </div>
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
