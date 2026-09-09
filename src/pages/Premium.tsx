import { useState } from "react";
import { Check, Mail, Sparkles, Coins, Zap, Crown } from "lucide-react";
import { useApp } from "../context/AppContext";

const PLANS = [
  {
    name: "Free",
    price: "0",
    tokens: "50 token/mese",
    desc: "Per scoprire B&F 45",
    icon: Sparkles,
    color: "border-cream-200 bg-cream-50",
    features: [
      "50 token al mese per consulenze AI",
      "Ricerca abbinamenti illimitata",
      "Catalogo completo (oltre 600 vini)",
      "Quiz del gusto",
      "1 ricerca salvata",
    ],
  },
  {
    name: "Plus",
    price: "4,90",
    tokens: "500 token/mese",
    desc: "Per appassionati che vogliono di più",
    icon: Zap,
    color: "border-gold-400 bg-gradient-to-br from-gold-50 to-cream-50",
    popular: true,
    features: [
      "500 token al mese",
      "Consulenze AI private illimitate (entro i token)",
      "Wine Lab con AI avanzata",
      "Consigli culinari personalizzati",
      "Storico preferenze e gusto",
      "Nuove selezioni in anteprima",
      "Nessun vincolo, cancelli quando vuoi",
    ],
  },
  {
    name: "Connoisseur",
    price: "9,90",
    tokens: "2000 token/mese",
    desc: "Per chi vuole il massimo",
    icon: Crown,
    color: "border-bordeaux-300 bg-bordeaux-50",
    features: [
      "2000 token al mese",
      "Tutto di Plus",
      "Consulenze AI avanzate con analisi molecolare completa",
      "Abbinamenti esclusivi via email",
      "Accesso anticipato a nuove funzioni",
      "Priorità nelle richieste AI",
      "Badge Connoisseur sul profilo",
    ],
  },
];

export default function Premium() {
  const { user } = useApp();
  const [email, setEmail] = useState(user?.email || "");
  const [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (email.includes("@")) setSent(true); };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="w-14 h-14 rounded-2xl bg-gold-100 flex items-center justify-center mx-auto mb-5">
          <Sparkles className="w-7 h-7 text-gold-600" />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-600">B&F 45 Premium</p>
        <h1 className="font-serif text-4xl md:text-5xl text-bordeaux-950 mt-3">Il tuo sommelier personale con AI.</h1>
        <p className="text-bordeaux-600 mt-4 text-lg">
          Ogni piano include un numero di token AI per consulenze, abbinamenti e analisi molecolari.
          Più token, più approfondimenti. Scegli il piano giusto per te.
        </p>
      </div>

      {/* Token explanation */}
      <div className="max-w-2xl mx-auto mb-10 p-5 rounded-2xl bg-bordeaux-50 border border-bordeaux-200">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5 text-gold-600" />
          <h3 className="font-serif text-lg text-bordeaux-950">Come funzionano i token?</h3>
        </div>
        <p className="text-sm text-bordeaux-600 leading-relaxed">
          Ogni consulenza AI consuma token: una ricerca di abbinamento usa circa 5 token, una consulenza
          completa con Wine Lab circa 15 token, un'analisi molecolare dettagliata circa 30 token.
          I token si rinnovano ogni mese e non si accumulano.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`p-6 rounded-2xl border ${plan.color} relative ${plan.popular ? "md:scale-105 shadow-lg" : ""}`}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-gold-400 text-bordeaux-950 font-semibold">
                Più scelto
              </span>
            )}
            <plan.icon className={`w-8 h-8 mb-3 ${plan.name === "Connoisseur" ? "text-bordeaux-700" : "text-gold-600"}`} />
            <h3 className="font-serif text-2xl text-bordeaux-950">{plan.name}</h3>
            <p className="text-xs text-bordeaux-500 mt-1">{plan.desc}</p>
            <div className="mt-4">
              <strong className="font-serif text-4xl text-bordeaux-950">€{plan.price}</strong>
              <span className="text-sm text-bordeaux-500">/mese</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Coins className="w-4 h-4 text-gold-600" />
              <span className="text-sm font-semibold text-gold-700">{plan.tokens}</span>
            </div>
            <ul className="space-y-2.5 mt-5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs text-bordeaux-700">
                  <Check className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.name !== "Free" && (
              <button
                onClick={() => document.getElementById("premium-form")?.scrollIntoView({ behavior: "smooth" })}
                className={`w-full mt-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${plan.popular ? "bg-gold-400 text-bordeaux-950 hover:bg-gold-300" : "bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700"}`}
              >
                Attiva {plan.name}
              </button>
            )}
            {plan.name === "Free" && (
              <p className="text-center text-xs text-bordeaux-500 mt-5">Già attivo con il tuo account</p>
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div id="premium-form" className="max-w-md mx-auto p-7 rounded-2xl bg-bordeaux-950 text-cream-100 text-center">
        <p className="text-sm text-cream-300">14 giorni gratis del piano Plus se ti iscrivi entro il 30 settembre</p>
        {sent ? (
          <div className="mt-5 p-4 rounded-lg bg-bordeaux-800 text-sm text-gold-200">
            Controlla la tua email: ti abbiamo inviato il link per attivare i 14 giorni gratuiti.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bordeaux-400" />
              <input required type="email" placeholder="La tua email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-lg bg-cream-50 text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <button type="submit" className="w-full mt-3 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors">
              Attiva prova gratuita
            </button>
          </form>
        )}
        <p className="text-center text-xs text-cream-400 mt-4">Nessun pagamento oggi. Il piano sarà attivabile quando collegheremo il pagamento reale.</p>
      </div>
    </div>
  );
}
