import { useState } from "react";
import { Check, Send, Store, Users, Wine, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";

const VENUE_TYPES = ["Trattoria", "Vineria", "Beach club", "Hotel", "Locale serale", "Fine dining", "Pizzeria", "Agriturismo", "Cocktail bar", "Altro"];
const PLANS = [
  { name: "Essenziale", price: "49", desc: "Per piccoli locali che vogliono una carta più sicura", features: ["Carta vini digitale", "Analisi menu", "10 consulenze al mese", "Report mensile"] },
  { name: "Professionale", price: "99", desc: "Per ristoranti che vogliono vendere meglio in sala", features: ["Tutto di Essenziale", "Consulenze illimitate", "Formazione staff", "Vendita assistita in sala", "Carta vini viva"] },
  { name: "Signature", price: "199", desc: "Per gruppi, hotel e locali ad alta rotazione", features: ["Tutto di Professionale", "Onboarding dedicato", "Strategia prezzi e margini", "Supporto prioritario", "Analisi multi-locale"] },
];

export default function B2B() {
  const { user } = useApp();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: user?.email || "", venue: "", seats: "", budget: "", note: "" });
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSent(true); };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="max-w-3xl mb-12">
        <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-3">B&F 45 for business</p>
        <h1 className="font-serif text-4xl md:text-5xl text-bordeaux-950">Una carta vini che lavora con te.</h1>
        <p className="text-bordeaux-600 mt-4 text-lg">Consulenza molecolare, formazione e strumenti di vendita per trasformare ogni calice in un'esperienza memorabile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-14">
        {[
          { icon: Wine, title: "Carta dei vini viva", text: "Una selezione aggiornata che segue menu, stagioni, margini e preferenze dei tuoi ospiti." },
          { icon: Users, title: "Formazione staff", text: "Schede semplici e consulenza contestuale per far raccontare il vino con sicurezza in sala." },
          { icon: TrendingUp, title: "Vendita assistita", text: "Suggerimenti in tempo reale per aumentare conversione, soddisfazione e valore medio del tavolo." },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-2xl bg-cream-100 border border-cream-200">
            <item.icon className="w-8 h-8 text-bordeaux-700 mb-4" />
            <h2 className="font-serif text-xl text-bordeaux-950">{item.title}</h2>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        <section className="p-6 md:p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <div className="flex items-center gap-3 mb-5"><Store className="w-6 h-6 text-gold-400" /><h2 className="font-serif text-2xl text-cream-50">Richiedi una demo</h2></div>
          {sent ? (
            <div className="py-10 text-center"><Check className="w-12 h-12 text-gold-400 mx-auto mb-4" /><h3 className="font-serif text-2xl text-cream-50">Richiesta ricevuta</h3><p className="text-cream-300 mt-2">Ti contatteremo per capire il tuo locale e preparare una demo su misura.</p></div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder="Nome e cognome" value={form.name} onChange={(e) => update("name", e.target.value)} className="px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className="px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select required value={form.venue} onChange={(e) => update("venue", e.target.value)} className="px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-200 focus:outline-none focus:ring-2 focus:ring-gold-400"><option value="">Tipo di locale</option>{VENUE_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
                <input required type="number" min="1" placeholder="Coperti medi" value={form.seats} onChange={(e) => update("seats", e.target.value)} className="px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className="w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-200 focus:outline-none focus:ring-2 focus:ring-gold-400"><option value="">Fascia prezzo media della carta</option><option>Fino a 20€</option><option>20–40€</option><option>40–80€</option><option>Oltre 80€</option></select>
              <textarea required rows={4} placeholder="Raccontaci menu, obiettivi e difficoltà attuali..." value={form.note} onChange={(e) => update("note", e.target.value)} className="w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              <button type="submit" className="w-full py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Invia richiesta</button>
            </form>
          )}
        </section>

        <section>
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-3">Piani mensili</p>
          <h2 className="font-serif text-3xl text-bordeaux-950 mb-5">Scegli il ritmo del tuo locale.</h2>
          <div className="space-y-3">{PLANS.map((plan, index) => <div key={plan.name} className={`p-5 rounded-xl border ${index === 1 ? "border-gold-400 bg-gold-50" : "border-cream-200 bg-cream-50"}`}><div className="flex items-start justify-between gap-4"><div><h3 className="font-serif text-xl text-bordeaux-950">{plan.name}</h3><p className="text-xs text-bordeaux-600 mt-1">{plan.desc}</p></div><div className="text-right"><strong className="font-serif text-2xl text-bordeaux-950">€{plan.price}</strong><span className="text-xs text-bordeaux-500">/mese</span></div></div><ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-4">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-1.5 text-xs text-bordeaux-700"><Check className="w-3.5 h-3.5 text-gold-600" />{feature}</li>)}</ul></div>)}</div>
          <p className="text-sm text-bordeaux-700 mt-4 font-medium">14 giorni gratis se ti iscrivi entro il 30 settembre.</p>
        </section>
      </div>
    </div>
  );
}
