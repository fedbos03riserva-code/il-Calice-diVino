import { useState } from "react";
import { Mail, MapPin, Phone, GraduationCap, Leaf, Cpu, ArrowRight, Wine, FlaskConical, Globe, Briefcase, Send, CheckCircle2, Building2, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";

const ROLES = [
  { value: "cantine", label: "Cantina / Produttore" },
  { value: "ristoratore", label: "Ristoratore / Locale" },
  { value: "export", label: "Export / Distributore estero" },
  { value: "sviluppatore", label: "Sviluppatore / Tecnologo" },
  { value: "marketing", label: "Marketing / Comunicazione" },
  { value: "investitore", label: "Investitore / Partner" },
  { value: "altro", label: "Altro" },
];

export default function About() {
  const { t } = useApp();
  const [form, setForm] = useState({ name: "", email: "", role: "cantine", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: insertError } = await supabase
      .from("work_with_us")
      .insert({ name: form.name, email: form.email, role: form.role, message: form.message });
    if (insertError) {
      setError("Errore nell'invio. Riprova.");
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Hero */}
      <section className="mb-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-bordeaux-950 via-bordeaux-900 to-bordeaux-800 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(200,157,46,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(155,18,56,0.3) 0%, transparent 40%)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Wine className="w-8 h-8 text-gold-400" />
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Chi siamo</p>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-cream-50">B&F 45</h1>
          <p className="text-cream-200 mt-4 text-lg leading-relaxed max-w-2xl">
            Il portale n.1 dell'Oltrepò Pavese per export, abbinamento e valorizzazione del territorio del vino.
            Uniamo la scienza del gusto alla tradizione enologica con un motore di abbinamento molecolare che analizza acidità, tannini, struttura e profilo aromatico.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
              <FlaskConical className="w-3.5 h-3.5 text-gold-400" /> Abbinamento molecolare
            </span>
            <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
              <Truck className="w-3.5 h-3.5 text-gold-400" /> Export B2B
            </span>
            <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
              <Building2 className="w-3.5 h-3.5 text-gold-400" /> 12 cantine partner
            </span>
          </div>
        </div>
      </section>

      {/* Missione */}
      <section className="mb-14">
        <h2 className="font-serif text-2xl text-bordeaux-950 mb-4">La nostra missione</h2>
        <p className="text-bordeaux-600 leading-relaxed">
          Rendere l'Oltrepò Pavese il territorio del vino più conosciuto d'Italia. A 1 ora da Milano, con 110+ etichette e 7 denominazioni DOC/DOCG,
          meritava una piattaforma digitale all'altezza. B&F 45 è il primo portale che unisce abbinamento molecolare AI, export B2B e carta vini viva
          in un unico strumento dedicato a questo territorio.
        </p>
      </section>

      {/* Cosa facciamo */}
      <section className="mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-cream-100 border border-cream-200">
            <FlaskConical className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">Abbinamento AI</h3>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">Motore IRC a 4 dimensioni (chimica, aromaticità, struttura, pulizia) per il punteggio oggettivo da 0 a 100.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gold-50 border border-gold-200">
            <Truck className="w-8 h-8 text-gold-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">Export B2B</h3>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">AI Winery Matching, RFQ strutturati, processo export guidato per connettere cantine e buyer internazionali.</p>
          </div>
          <div className="p-6 rounded-2xl bg-bordeaux-50 border border-bordeaux-200">
            <Globe className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">Territorio</h3>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">110+ etichette, 12 cantine, 7 denominazioni DOC/DOCG. Il piu grande catalogo digitale dell'Oltrepò.</p>
          </div>
        </div>
      </section>

      {/* Fondatore */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <GraduationCap className="w-7 h-7 text-gold-600" />
          <h2 className="font-serif text-2xl text-bordeaux-950">Il fondatore</h2>
        </div>
        <div className="p-8 rounded-2xl bg-gradient-to-br from-bordeaux-950 to-bordeaux-800 text-cream-100">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gold-400 flex items-center justify-center">
                <span className="font-serif text-3xl text-bordeaux-950">FB</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-cream-50">Federico Bosoni</h3>
              <p className="text-sm text-gold-400 mt-1">Ingegneria per l'Ambiente e il Territorio — Politecnico di Milano</p>
              <p className="text-sm text-cream-200 mt-4 leading-relaxed">
                Appassionato di vino, intelligenza artificiale e agritech, unisce la precisione della modellistica ambientale
                all'amore per il territorio per costruire soluzioni digitali che valorizzano la tradizione enologica attraverso la scienza.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30"><Wine className="w-3.5 h-3.5 text-gold-400" /> Vino & AI</span>
                <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30"><Leaf className="w-3.5 h-3.5 text-gold-400" /> Sostenibilita</span>
                <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30"><Cpu className="w-3.5 h-3.5 text-gold-400" /> Automazione</span>
                <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30"><GraduationCap className="w-3.5 h-3.5 text-gold-400" /> Agritech</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lavora con noi */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Briefcase className="w-7 h-7 text-gold-600" />
          <h2 className="font-serif text-2xl text-bordeaux-950">Lavora con noi</h2>
        </div>
        <p className="text-sm text-bordeaux-600 mb-5 leading-relaxed">
          Sei una cantina, un ristoratore, un distributore estero o un professionista del vino?
          Unisciti alla piattaforma n.1 dell'Oltrepò Pavese. Raccontaci chi sei e ti ricontatteremo.
        </p>
        {submitted ? (
          <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-serif text-xl text-bordeaux-950">Messaggio inviato!</h3>
            <p className="text-sm text-bordeaux-600 mt-2">Ti ricontatteremo entro 48 ore.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", role: "cantine", message: "" }); }}
              className="mt-4 text-sm text-bordeaux-700 hover:text-gold-600 font-medium">
              Invia un altro messaggio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-cream-100 border border-cream-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-bordeaux-700 mb-1 block">Nome e cognome</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  placeholder="Mario Rossi" />
              </div>
              <div>
                <label className="text-xs font-semibold text-bordeaux-700 mb-1 block">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  placeholder="mario@email.com" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-bordeaux-700 mb-1 block">Ruolo / profilo</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-bordeaux-700 mb-1 block">Messaggio</label>
              <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
                placeholder="Raccontaci chi sei e come vorresti collaborare..." />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors disabled:opacity-50">
              {submitting ? "Invio..." : "Invia"} <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </section>

      {/* Contatti */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-bordeaux-950 mb-5">Contatti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cream-100 to-cream-200 border border-cream-300">
            <Mail className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-500">Email</p>
            <p className="text-sm text-bordeaux-950 mt-1 font-medium">info@bf45.it</p>
            <p className="text-xs text-bordeaux-500 mt-1">Risposta entro 24h</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200">
            <Phone className="w-5 h-5 text-gold-700 mb-2" />
            <p className="text-xs text-gold-600">Telefono</p>
            <p className="text-sm text-bordeaux-950 mt-1 font-medium">+39 02 1234 5678</p>
            <p className="text-xs text-gold-600 mt-1">Lun-Ven 9:00-18:00</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-bordeaux-50 to-bordeaux-100 border border-bordeaux-200">
            <MapPin className="w-5 h-5 text-bordeaux-700 mb-2" />
            <p className="text-xs text-bordeaux-500">Sede</p>
            <p className="text-sm text-bordeaux-950 mt-1 font-medium">Oltrepò Pavese, Lombardia</p>
            <p className="text-xs text-bordeaux-500 mt-1">A 1 ora da Milano</p>
          </div>
        </div>
      </section>

      <section className="text-center py-8">
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
          {t("nav.home")} <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
