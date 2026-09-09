import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Send, CheckCircle, Wine, GraduationCap, ClipboardList, Users, Clock } from "lucide-react";

const VENUE_TYPES = ["Trattoria", "Vineria", "Beach club", "Hotel", "Locale serale", "Fine dining", "Pizzeria", "Agriturismo", "Cocktail bar", "Altro"];

export default function PrivateConsulting() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ venueName: "", contact: "", phone: "", email: "", venueType: "", message: "" });
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  const services = [
    { icon: ClipboardList, title: "Analisi carta vini esistente", desc: "Esaminiamo la tua carta attuale: copertura, equilibrio, margini e buchi di abbinamento rispetto al menu." },
    { icon: Wine, title: "Selezione vini su misura", desc: "Ti proponiamo etichette coerenti con la tua cucina, il tuo territorio e il tuo posizionamento di prezzo." },
    { icon: Users, title: "Formazione dello staff", desc: "Sessioni pratiche con il personale di sala: linguaggio, raccomandazioni e tecniche di upselling." },
  ];

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-bordeaux-950">Richiesta ricevuta</h1>
        <p className="text-bordeaux-600 mt-4 leading-relaxed">
          Grazie {form.contact || ""}! Ti contatteremo entro 48 ore per organizzare una sessione di consulenza
          su misura per il tuo locale.
        </p>
        <button onClick={() => navigate("/")} className="mt-8 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
          Torna alla home
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <button onClick={() => navigate("/b2b")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> Torna a Business
      </button>

      {/* Header */}
      <div className="max-w-3xl mb-10">
        <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-3">Consulenza privata</p>
        <h1 className="font-serif text-4xl md:text-5xl text-bordeaux-950">Parla con un nostro esperto sommelier.</h1>
        <p className="text-bordeaux-600 mt-4 text-lg leading-relaxed">
          Un servizio di consulenza umana — non AI. Un nostro enologo analizza la carta vini del tuo locale,
          seleziona etichette su misura e forma il tuo staff. Servizio aggiuntivo a partire da 199€.
        </p>
      </div>

      {/* Expert bio placeholder */}
      <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-bordeaux-950 to-bordeaux-800 text-cream-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gold-400 flex items-center justify-center">
              <User className="w-12 h-12 text-bordeaux-950" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gold-400 uppercase tracking-wider">Il tuo esperto</p>
            <h3 className="font-serif text-2xl text-cream-50 mt-1">Sommelier & Enologo</h3>
            <p className="text-sm text-cream-300 mt-2 leading-relaxed">
              Il nostro esperto ha oltre 15 anni di esperienza nella selezione vini per ristoranti di alto livello,
              dalla trattoria di provincia al fine dining stellato. Certificazione AIS e diploma di enologia.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
                <GraduationCap className="w-3.5 h-3.5 text-gold-400" /> Certificazione AIS
              </span>
              <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
                <Wine className="w-3.5 h-3.5 text-gold-400" /> 15+ anni esperienza
              </span>
              <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
                <Clock className="w-3.5 h-3.5 text-gold-400" /> Risposta entro 48h
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services */}
        <section>
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-5">Cosa include</h2>
          <div className="space-y-4">
            {services.map((s) => (
              <div key={s.title} className="p-5 rounded-xl bg-cream-100 border border-cream-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bordeaux-800 flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-bordeaux-950">{s.title}</h3>
                    <p className="text-sm text-bordeaux-600 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-gold-50 border border-gold-200">
            <p className="text-sm text-bordeaux-800">
              <strong>Incluso nel piano Signature</strong> — una sessione al mese con il nostro esperto.
              Per gli altri piani, servizio aggiuntivo a partire da <strong>199€</strong>.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="p-6 md:p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <div className="flex items-center gap-3 mb-5">
            <Send className="w-6 h-6 text-gold-400" />
            <h2 className="font-serif text-2xl text-cream-50">Richiedi un appuntamento</h2>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-cream-300 block mb-1">Nome del locale *</label>
              <input required value={form.venueName} onChange={(e) => update("venueName", e.target.value)} className={inputClass} placeholder="Es. Trattoria da Mario" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-cream-300 block mb-1">Referente *</label>
                <input required value={form.contact} onChange={(e) => update("contact", e.target.value)} className={inputClass} placeholder="Nome e cognome" />
              </div>
              <div>
                <label className="text-xs text-cream-300 block mb-1">Telefono *</label>
                <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="+39 ..." />
              </div>
            </div>
            <div>
              <label className="text-xs text-cream-300 block mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="email@locale.it" />
            </div>
            <div>
              <label className="text-xs text-cream-300 block mb-1">Tipo di locale</label>
              <select value={form.venueType} onChange={(e) => update("venueType", e.target.value)} className={inputClass + " text-cream-200"}>
                <option value="">Seleziona...</option>
                {VENUE_TYPES.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-cream-300 block mb-1">Messaggio</label>
              <textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass + " resize-none"} placeholder="Descrivi il tuo locale, il menu, e cosa ti aspetti dalla consulenza..." />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Invia richiesta
            </button>
            <p className="text-xs text-cream-400 text-center">Nessun pagamento immediato. Ti contatteremo entro 48 ore.</p>
          </form>
        </section>
      </div>
    </div>
  );
}
