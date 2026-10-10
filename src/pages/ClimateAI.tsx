import { useState } from "react";
import { Cloud, Sun, Droplets, Thermometer, TrendingUp, AlertTriangle, Leaf, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { KeyRound } from "lucide-react";

const VITIGNI = [
  "Tutti i vitigni",
  "Pinot Nero",
  "Croatina (Bonarda)",
  "Barbera",
  "Riesling",
  "Moscato",
  "Ughetta di Canneto",
  "Buttafuoco",
];

interface ClimateResult {
  rischi_climatici: Array<{
    vitigno: string;
    rischio: string;
    livello: string;
    periodo: string;
    dettaglio: string;
  }>;
  adattamenti: Array<{
    pratica: string;
    descrizione: string;
    priorita: string;
  }>;
  proiezioni: Array<{
    orizzonte: string;
    scenario: string;
    temperatura_media: string;
    precipitazioni: string;
    impatto_vitigni: string;
  }>;
  vitigni_resilienti: Array<{
    vitigno: string;
    motivazione: string;
    score_resilienza: number;
  }>;
  monitoraggio: string[];
  sintesi: string;
}

export default function ClimateAI() {
  const { t, lang } = useApp();
  const [vitigno, setVitigno] = useState("Tutti i vitigni");
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-climate-oltrepo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}` },
        body: JSON.stringify({
          vitigno: vitigno === "Tutti i vitigni" ? "tutti" : vitigno,
          lang,
          scenario: scenario || undefined,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errData = await response.json().catch(() => null);
        if (errData?.error === "AI_NOT_CONFIGURED") {
          setError("AI non ancora configurata. Vai sulla pagina di configurazione per attivare la chiave API.");
        } else {
          setError("Analisi non disponibile. Riprova piu tardi.");
        }
      }
    } catch {
      setError("Errore di connessione. Riprova.");
    }
    setLoading(false);
  };

  const livelloColor = (livello: string) => {
    switch (livello) {
      case "basso": return "bg-green-100 text-green-700 border-green-300";
      case "medio": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "alto": return "bg-orange-100 text-orange-700 border-orange-300";
      case "critico": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-cream-100 text-bordeaux-700 border-cream-300";
    }
  };

  const prioritaColor = (priorita: string) => {
    switch (priorita) {
      case "alta": return "bg-red-50 text-red-700 border-red-200";
      case "media": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "bassa": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-cream-100 text-bordeaux-700 border-cream-200";
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5" /> AI Climatica
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">Riserva Climatica Oltrepò</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">
            Analisi AI dell'impatto del cambiamento climatico sulla viticoltura dell'Oltrepò Pavese.
            Rischi per vitigno, strategie di adattamento, proiezioni a 5/10/20 anni e vitigni piu resilienti.
          </p>
        </div>

        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-bordeaux-700 mb-1 block">Vitigno da analizzare</label>
              <select value={vitigno} onChange={(e) => setVitigno(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
                {VITIGNI.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-bordeaux-700 mb-1 block">Scenario specifico (opzionale)</label>
              <input type="text" value={scenario} onChange={(e) => setScenario(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                placeholder="es: aumento temperatura +2°C, siccita estiva" />
            </div>
          </div>
          <button onClick={runAnalysis} disabled={loading}
            className="mt-4 flex items-center gap-2 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analisi in corso...</> : <><Sparkles className="w-4 h-4" /> Avvia analisi climatica</>}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            {error.includes("configurazione") && (
              <Link to="/ai-setup" className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bordeaux-800 text-cream-50 text-xs font-medium hover:bg-bordeaux-700 transition-colors">
                <KeyRound className="w-3.5 h-3.5" /> Come attivare l'AI
              </Link>
            )}
          </div>
        )}

        {loading && !result && (
          <div className="p-12 rounded-2xl bg-cream-50 border border-cream-200 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Cloud className="w-12 h-12 text-bordeaux-300" />
                <Sun className="w-6 h-6 text-gold-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <p className="text-sm text-bordeaux-500">L'AI sta analizzando i dati climatici dell'Oltrepò Pavese...</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Sintesi */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-bordeaux-950 to-bordeaux-800 text-cream-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-xl text-cream-50">Sintesi</h2>
              </div>
              <p className="text-sm text-cream-200 leading-relaxed">{result.sintesi}</p>
            </div>

            {/* Rischi climatici */}
            {result.rischi_climatici?.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" /> Rischi climatici per vitigno
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.rischi_climatici.map((r, i) => (
                    <div key={i} className="p-4 rounded-xl bg-cream-50 border border-cream-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-sm text-bordeaux-950">{r.vitigno}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${livelloColor(r.livello)}`}>{r.livello}</span>
                      </div>
                      <p className="text-sm text-bordeaux-700 font-medium">{r.rischio}</p>
                      <p className="text-xs text-bordeaux-500 mt-1">{r.dettaglio}</p>
                      <p className="text-xs text-bordeaux-400 mt-1">Periodo: {r.periodo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adattamenti */}
            {result.adattamenti?.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" /> Strategie di adattamento
                </h2>
                <div className="space-y-2">
                  {result.adattamenti.map((a, i) => (
                    <div key={i} className="p-4 rounded-xl bg-green-50 border border-green-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-bordeaux-950">{a.pratica}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${prioritaColor(a.priorita)}`}>{a.priorita}</span>
                      </div>
                      <p className="text-xs text-bordeaux-600">{a.descrizione}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proiezioni */}
            {result.proiezioni?.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold-600" /> Proiezioni climatiche
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.proiezioni.map((p, i) => (
                    <div key={i} className="p-4 rounded-xl bg-bordeaux-950 text-cream-100">
                      <p className="font-serif text-lg text-gold-400">{p.orizzonte}</p>
                      <p className="text-xs text-cream-300 mt-1">{p.scenario}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs flex items-center gap-1.5"><Thermometer className="w-3 h-3 text-gold-400" /> {p.temperatura_media}</p>
                        <p className="text-xs flex items-center gap-1.5"><Droplets className="w-3 h-3 text-gold-400" /> {p.precipitazioni}</p>
                      </div>
                      <p className="text-xs text-cream-200 mt-2 pt-2 border-t border-bordeaux-700">{p.impatto_vitigni}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vitigni resilienti */}
            {result.vitigni_resilienti?.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" /> Vitigni piu resilienti
                </h2>
                <div className="space-y-2">
                  {result.vitigni_resilienti.map((v, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-cream-50 border border-cream-200">
                      <div className="shrink-0">
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#f5e6c8" strokeWidth="4" />
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#16a34a" strokeWidth="4"
                              strokeDasharray={`${(v.score_resilienza / 100) * 125.6} 125.6`} strokeLinecap="round" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-bordeaux-950">{v.score_resilienza}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-bordeaux-950">{v.vitigno}</p>
                        <p className="text-xs text-bordeaux-600">{v.motivazione}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monitoraggio */}
            {result.monitoraggio?.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-bordeaux-600" /> Dati da monitorare
                </h2>
                <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
                  <ul className="space-y-2">
                    {result.monitoraggio.map((m, i) => (
                      <li key={i} className="text-sm text-bordeaux-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 shrink-0" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors text-sm">
                {t("nav.home")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="p-12 rounded-2xl bg-cream-50 border border-cream-200 text-center">
            <Cloud className="w-12 h-12 text-bordeaux-300 mx-auto mb-3" />
            <p className="text-sm text-bordeaux-500">Seleziona un vitigno e avvia l'analisi climatica per ottenere rischi, adattamenti e proiezioni.</p>
          </div>
        )}
      </div>
    </div>
  );
}
