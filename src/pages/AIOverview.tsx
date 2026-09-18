import { useState, useEffect } from "react";
import { Brain, Sparkles, Crown, FlaskConical, Globe2, Cpu, Zap, Atom, MapPin, Activity, Clock, Thermometer, Beaker, ArrowRight, Check, AlertCircle, Database, Shield, KeyRound, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";

interface CodeRow {
  id: string;
  code: string;
  plan: string;
  max_uses: number;
  uses_count: number;
  daily_limit: number;
  daily_uses_count: number;
  daily_reset_at: string | null;
  expires_at: string | null;
  active: boolean;
}

export default function AIOverview() {
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCodes = async () => {
    setRefreshing(true);
    const { data } = await supabase
      .from("ai_access_codes")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setCodes(data as CodeRow[]);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { loadCodes(); }, []);

  const functions = [
    {
      icon: FlaskConical,
      title: "Abbinamento Cibo-Vino (IRC)",
      where: "Abbinamenti, Wine Lab, Reverse Pairing, Wine Detail",
      desc: "Il motore IRC analizza il piatto a livello molecolare e calcola la compatibilita con ogni vino del catalogo. Identifica grassi, proteine, acidi, volatili, piccantezza, umami e dolcezza, poi applica 15 principi chimico-enologici per assegnare un punteggio 0-100.",
      tech: ["15 principi chimici", "4 dimensioni IRC (chimica, aromatico, struttura, pulizia)", "Composti per nome esatto", "Discorso narrativo perche del vino"],
      models: "Base: Claude 3.5 Haiku (4k token) | PRO: Claude Sonnet 4 (6k token)",
      color: "bg-bordeaux-50 border-bordeaux-200",
    },
    {
      icon: Globe2,
      title: "Matching Cantina-Buyer (Export)",
      where: "AI Matching, Winery Match",
      desc: "Analizza la richiesta libera di un buyer estero e la confronta con il profilo di ogni cantina. Valuta denominazione, tipologia, mercato target, certificazioni, capacita produttiva, prezzo FOB, incoterms e team multilingue.",
      tech: ["9 criteri di valutazione con pesi", "Matching locale + AI semantica", "Score 0-100 per cantina", "Sintesi AI e raccomandazioni"],
      models: "AI: Claude 3.5 Haiku con analisi semantica",
      color: "bg-cream-50 border-cream-200",
    },
    {
      icon: MapPin,
      title: "GeoMapping Satellitare",
      where: "Mappa Cantine, Wine Map",
      desc: "Mappa interattiva con coordinate GPS reali per ogni cantina dell'Oltrepo Pavese. Layer satellitare Esri + OpenStreetMap via Leaflet. Poligoni GeoJSON per le 4 zone DOC.",
      tech: ["Esri World Imagery", "OpenStreetMap vettoriale", "Leaflet.js", "GeoJSON zone DOC"],
      models: "Non usa AI — tecnologia geospaziale pura",
      color: "bg-gold-50 border-gold-200",
    },
    {
      icon: Beaker,
      title: "Analisi Digestiva",
      where: "Abbinamenti (PRO), Wine Detail (PRO)",
      desc: "In modalita PRO, il motore considera l'impatto digestivo dell'abbinamento: acidita e secrezione gastrica, tannini e digestione proteica, CO2 e sazieta, etanolo e assorbimento vitaminico, zuccheri e disarmonia digestiva.",
      tech: ["5 dimensioni digestive", "Solo modalita PRO", "Integrato nel discorso perche del vino"],
      models: "Solo PRO: Claude Sonnet 4",
      color: "bg-bordeaux-50 border-bordeaux-200",
    },
  ];

  const features = [
    { icon: Crown, label: "Modalita PRO", desc: "Analisi molecolare avanzata con discorsi narrativi di 4-5 righe, temperatura di servizio calcolata, tempo di decantazione, molecole protagoniste (4-8 composti per nome chimico)" },
    { icon: Atom, label: "Molecole protagoniste", desc: "Ogni abbinamento elenca i composti chimici coinvolti: acido tartarico, procianidine B1-B4, linalolo, geosmina, etil-butirrato, vanillina, ecc." },
    { icon: Thermometer, label: "Temperatura di servizio", desc: "Calcolata in base alla volatilita dei composti aromatici (costante di Henry), struttura del vino e temperatura del piatto" },
    { icon: Clock, label: "Tempo di decantazione", desc: "Minuti consigliati basati sul livello di tannini e peso molecolare dei polimeri" },
    { icon: Activity, label: "Scoring IRC granulare", desc: "Chimica (0-40), Aromatico (0-25), Struttura (0-20), Pulizia (0-15) con pesi specifici per ogni interazione" },
    { icon: Shield, label: "Sicurezza e limiti", desc: "Rate limiting 10 req/min per IP, codici monouso con limite totale + giornaliero, sanitizzazione input, RLS su tutte le tabelle" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-bordeaux-950 flex items-center justify-center">
          <Brain className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600">Panoramica AI</p>
          <h2 className="font-serif text-2xl text-bordeaux-950">Funzioni AI di Bwine</h2>
        </div>
      </div>

      <p className="text-sm text-bordeaux-600 max-w-2xl">
        Tutte le funzioni dell'intelligenza artificiale di Bwine, dove si trovano nell'app, come funzionano e quali modelli usano.
      </p>

      {/* AI Functions */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-bordeaux-950">Funzioni attive</h3>
        {functions.map((fn, i) => (
          <div key={i} className={`p-5 rounded-xl border ${fn.color}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-bordeaux-950 flex items-center justify-center shrink-0">
                <fn.icon className="w-6 h-6 text-gold-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-lg text-bordeaux-950">{fn.title}</h4>
                <p className="text-xs text-bordeaux-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Disponibile in: {fn.where}
                </p>
                <p className="text-sm text-bordeaux-700 mt-2 leading-relaxed">{fn.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {fn.tech.map((t, j) => (
                    <span key={j} className="text-[10px] px-2 py-1 rounded-full bg-cream-100 text-bordeaux-700 border border-cream-200">{t}</span>
                  ))}
                </div>
                <p className="text-xs text-bordeaux-500 mt-2 flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> {fn.models}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRO Features */}
      <div className="p-6 rounded-xl bg-bordeaux-950 text-cream-100">
        <h3 className="font-serif text-lg text-gold-400 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5" /> Funzioni PRO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-4 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
              <f.icon className="w-5 h-5 text-gold-400 mb-2" />
              <p className="text-xs font-semibold text-gold-400">{f.label}</p>
              <p className="text-xs text-cream-200 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Access Codes */}
      <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-bordeaux-950 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-bordeaux-600" /> Codici di accesso AI
          </h3>
          <button onClick={loadCodes} disabled={refreshing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-bordeaux-100 text-bordeaux-700 hover:bg-bordeaux-200 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Aggiorna
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-bordeaux-500">Caricamento codici...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-200 text-xs text-bordeaux-500 uppercase tracking-wider">
                  <th className="text-left py-2 px-3">Codice</th>
                  <th className="text-left py-2 px-3">Piano</th>
                  <th className="text-right py-2 px-3">Usi totali</th>
                  <th className="text-right py-2 px-3">Limite/giorno</th>
                  <th className="text-right py-2 px-3">Usi oggi</th>
                  <th className="text-right py-2 px-3">Rimasti oggi</th>
                  <th className="text-center py-2 px-3">Stato</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => {
                  const now = new Date();
                  let dailyUses = c.daily_uses_count || 0;
                  const dailyResetAt = c.daily_reset_at ? new Date(c.daily_reset_at) : null;
                  if (!dailyResetAt || (now.getTime() - dailyResetAt.getTime()) > 24 * 60 * 60 * 1000) {
                    dailyUses = 0;
                  }
                  const remainingToday = (c.daily_limit || 20) - dailyUses;
                  return (
                    <tr key={c.id} className="border-b border-cream-100 hover:bg-cream-100 transition-colors">
                      <td className="py-3 px-3 font-mono font-semibold text-bordeaux-950">{c.code}</td>
                      <td className="py-3 px-3 text-xs text-bordeaux-600">{c.plan}</td>
                      <td className="py-3 px-3 text-right text-xs text-bordeaux-600">{c.uses_count}/{c.max_uses}</td>
                      <td className="py-3 px-3 text-right text-xs text-bordeaux-600">{c.daily_limit || 20}</td>
                      <td className="py-3 px-3 text-right text-xs text-bordeaux-600">{dailyUses}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${remainingToday > 5 ? "bg-green-100 text-green-700" : remainingToday > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                          {remainingToday}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {c.active ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 flex items-center gap-1 w-fit mx-auto">
                            <Check className="w-3 h-3" /> Attivo
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 w-fit mx-auto">
                            <AlertCircle className="w-3 h-3" /> Disattivato
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 p-4 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
          <p className="text-xs font-semibold text-bordeaux-800 mb-2">Come funzionano i limiti</p>
          <ul className="text-xs text-bordeaux-600 space-y-1">
            <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <strong>Limite totale</strong>: numero massimo di usi per sempre (uses_count vs max_uses)</li>
            <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <strong>Limite giornaliero</strong>: numero massimo di usi in 24 ore. Si resetta automaticamente 24 ore dopo il primo uso della giornata</li>
            <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <strong>Scelta del motore</strong>: nei risultati puoi scegliere "Motore locale" (gratis, sempre disponibile) o "Motore AI" (usa il codice)</li>
            <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <strong>Modalita PRO</strong>: attivabile con il pulsante PRO quando l'AI e in uso. Richiede un codice con piano monthly o superiore</li>
          </ul>
        </div>
      </div>

      {/* Demo instructions */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-bordeaux-950 to-bordeaux-800 text-cream-100">
        <h3 className="font-serif text-lg text-gold-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> Come provare l'AI (Demo)
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
            <span className="text-xs font-mono text-gold-400 shrink-0">1.</span>
            <p className="text-xs text-cream-200">Vai su <strong>Abbinamenti</strong> e cerca un piatto (es. "bistecca alla fiorentina")</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
            <span className="text-xs font-mono text-gold-400 shrink-0">2.</span>
            <p className="text-xs text-cream-200">Nei risultati, clicca <strong>"Sblocca AI"</strong> e inserisci il codice <code className="text-gold-400 bg-bordeaux-950 px-1.5 py-0.5 rounded">BF45PROVA</code> (50 usi/giorno)</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
            <span className="text-xs font-mono text-gold-400 shrink-0">3.</span>
            <p className="text-xs text-cream-200">Scegli <strong>"Motore AI"</strong> per usare l'intelligenza artificiale, o <strong>"Motore locale"</strong> per l'algoritmo gratuito</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
            <span className="text-xs font-mono text-gold-400 shrink-0">4.</span>
            <p className="text-xs text-cream-200">Con il codice <code className="text-gold-400 bg-bordeaux-950 px-1.5 py-0.5 rounded">BF45PRO</code> puoi attivare la <strong>Modalita PRO</strong> per analisi molecolare avanzata con Claude Sonnet 4</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
            <span className="text-xs font-mono text-gold-400 shrink-0">5.</span>
            <p className="text-xs text-cream-200">Vai su <strong>AI Matching</strong> per provare il matching cantine-buyer con AI per l'export</p>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
        <h3 className="font-serif text-lg text-bordeaux-950 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-bordeaux-600" /> Stack tecnologico AI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: Brain, label: "Modelli AI", value: "Claude 3.5 Haiku (base) + Claude Sonnet 4 (PRO)" },
            { icon: Zap, label: "Runtime", value: "Supabase Edge Functions (Deno)" },
            { icon: Database, label: "Database", value: "PostgreSQL con tabelle ai_access_codes, winery_qr_data, rfq_requests" },
            { icon: Shield, label: "Sicurezza", value: "Rate limiting 10/min, codici con limite totale + giornaliero, RLS, CORS, sanitizzazione" },
            { icon: Cpu, label: "Motore locale", value: "Algoritmo TypeScript deterministico, sempre disponibile, <50ms" },
            { icon: MapPin, label: "GeoMapping", value: "Leaflet.js + Esri World Imagery + OpenStreetMap + GeoJSON" },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-cream-100 border border-cream-200">
              <t.icon className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-bordeaux-950">{t.label}</p>
                <p className="text-xs text-bordeaux-600 mt-0.5">{t.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
