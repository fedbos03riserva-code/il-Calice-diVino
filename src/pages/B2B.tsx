import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Send, Store, Users, Wine, TrendingUp, BookOpen, Coins, Beaker, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

const VENUE_TYPES = ["Trattoria", "Vineria", "Beach club", "Hotel", "Locale serale", "Fine dining", "Pizzeria", "Agriturismo", "Cocktail bar", "Altro"];

const PLANS = [
  {
    name: "Essenziale",
    price: "49",
    tokens: "500 token/mese",
    desc: "Per piccoli locali che vogliono una carta più sicura",
    features: [
      { label: "Carta vini digitale", detail: "La tua selezione online, aggiornabile in tempo reale senza ristampe" },
      { label: "Analisi menu", detail: "Il motore IRC confronta ogni piatto del tuo menù con i vini in carta" },
      { label: "10 consulenze AI al mese", detail: "Richiedi abbinamenti per piatti specifici o menu stagionali" },
      { label: "Wine Lab per testare varianti", detail: "Modifica ricette e guarda come cambia l'abbinamento prima di metterle in carta" },
      { label: "Report mensile", detail: "Statistiche su ricerche, preferenze clienti e vini più consigliati" },
    ],
  },
  {
    name: "Professionale",
    price: "99",
    tokens: "2000 token/mese",
    desc: "Per ristoranti che vogliono vendere meglio in sala",
    features: [
      { label: "Tutto di Essenziale", detail: "Include tutte le funzioni del piano Essenziale" },
      { label: "Consulenze AI illimitate", detail: "Abbinamenti su richiesta senza limite, per ogni piatto e cliente" },
      { label: "Formazione staff", detail: "Schede sintetiche per ogni vino: il personale di sala sa cosa raccomandare" },
      { label: "Vendita assistita in sala", detail: "Suggerimenti in tempo reale al tavolo per aumentare il valore medio" },
      { label: "Carta vini viva", detail: "QR code sul tavolo: il cliente vede descrizioni, abbinamenti e recensioni sul telefono" },
      { label: "Wine Lab avanzato", detail: "Testa varianti di ricetta con AI e salva le migliori per il menu stagionale" },
    ],
  },
  {
    name: "Signature",
    price: "199",
    tokens: "5000 token/mese",
    desc: "Per gruppi, hotel e locali ad alta rotazione",
    features: [
      { label: "Tutto di Professionale", detail: "Include tutte le funzioni del piano Professionale" },
      { label: "Onboarding dedicato", detail: "Ti aiutiamo a strutturare la carta vini iniziale su misura per il tuo locale" },
      { label: "Strategia prezzi e margini", detail: "Analisi dei margini per ottimizzare il ricarico di ogni bottiglia" },
      { label: "Consulenza umana inclusa", detail: "Una sessione al mese con un nostro esperto sommelier per la carta vini" },
      { label: "Supporto prioritario", detail: "Risposta garantita entro 2 ore, 7 giorni su 7" },
      { label: "Analisi multi-locale", detail: "Gestisci più sedi con dashboard centralizzata e confronti" },
    ],
  },
];

export default function B2B() {
  const { user } = useApp();
  const navigate = useNavigate();
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

      {/* Features dettagliate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-14">
        {[
          { icon: Wine, title: "Carta dei vini viva", color: "bg-bordeaux-800", text: "Una selezione aggiornata che segue menu, stagioni e margini. Il cliente scansiona un QR code sul tavolo e vede descrizioni del vino, abbinamenti consigliati e recensioni reali — direttamente sul suo telefono, senza app." },
          { icon: Users, title: "Formazione staff", color: "bg-gold-700", text: "Schede sintetiche per ogni vino in carta: il personale di sala impara in minuti cosa raccomandare e perché, con un linguaggio semplice basato sulla chimica del gusto, non sul giudizio personale." },
          { icon: TrendingUp, title: "Vendita assistita in sala", color: "bg-bordeaux-700", text: "Suggerimenti in tempo reale al tavolo: il sistema propone il vino migliore per ogni ordine, aumentando soddisfazione del cliente e valore medio del conto." },
          { icon: BookOpen, title: "Analisi menu completa", color: "bg-gold-600", text: "Il motore IRC analizza ogni piatto del tuo menù e lo confronta con tutti i vini in carta, segnalando abbinamenti eccellenti, buoni e da evitare — prima che il cliente lo chieda." },
          { icon: Beaker, title: "Wine Lab per ristoratori", color: "bg-bordeaux-600", text: "Testa varianti di ricetta prima di metterle in carta: modifica grasso, speziatura, cottura con gli slider o descrivi a parole libere la modifica, e l'AI ti dice come cambia l'abbinamento. Perfetto per menu stagionali e piatti del giorno." },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-2xl bg-cream-100 border border-cream-200">
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
              <item.icon className="w-6 h-6 text-cream-50" />
            </div>
            <h2 className="font-serif text-xl text-bordeaux-950">{item.title}</h2>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Token explanation banner */}
      <div className="mb-14 p-5 rounded-2xl bg-bordeaux-50 border border-bordeaux-200">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5 text-gold-600" />
          <h3 className="font-serif text-lg text-bordeaux-950">Token AI: come funzionano per i locali</h3>
        </div>
        <p className="text-sm text-bordeaux-600 leading-relaxed">
          Ogni piano include un numero di token AI per consulenze, analisi del menu e Wine Lab.
          Un'analisi del menu consuma circa 10 token, una sessione Wine Lab circa 15 token, una consulenza completa circa 30 token.
          I token si rinnovano ogni mese. Piano Signature include anche una consulenza umana mensile con un nostro esperto sommelier.
        </p>
      </div>

      {/* Upsell to consulenza privata */}
      <div className="mb-14 p-6 rounded-2xl bg-gradient-to-br from-bordeaux-900 to-bordeaux-950 text-cream-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-gold-400 mb-1">Servizio aggiuntivo</p>
          <h3 className="font-serif text-xl text-cream-50">Consulenza umana con sommelier esperto</h3>
          <p className="text-sm text-cream-300 mt-1">Analisi della carta, selezione vini su misura, formazione dello staff. A partire da 199€.</p>
        </div>
        <button onClick={() => navigate("/consulenza-privata")} className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors shrink-0">
          Prenota una consulenza <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        {/* Form demo */}
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

        {/* Piani con dettagli */}
        <section>
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-3">Piani mensili</p>
          <h2 className="font-serif text-3xl text-bordeaux-950 mb-5">Scegli il ritmo del tuo locale.</h2>
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
                    <span className="text-xs text-bordeaux-500">/mese</span>
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
          <p className="text-sm text-bordeaux-700 mt-4 font-medium">14 giorni gratis se ti iscrivi entro il 30 settembre.</p>
        </section>
      </div>
    </div>
  );
}
