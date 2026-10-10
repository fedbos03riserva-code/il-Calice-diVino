import { useState } from "react";
import { Cloud, Sun, Droplets, Thermometer, TrendingUp, AlertTriangle, Leaf, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { KeyRound } from "lucide-react";
import EngineToggle from "../components/EngineToggle";
import { getStoredCode } from "../lib/aiPairing";

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
  const [useAI, setUseAI] = useState(false);
  const [usedAI, setUsedAI] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (!useAI) {
      // Local climate engine - deterministic rules
      const vitignoKey = vitigno === "Tutti i vitigni" ? "tutti" : vitigno;
      const localResult = generateLocalClimate(vitignoKey, scenario);
      setResult(localResult);
      setUsedAI(false);
      setLoading(false);
      return;
    }

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
        if (data._source === "rules") {
          setResult(data);
          setUsedAI(false);
          setError("AI Anthropic non ancora configurata. Mostro risultati del motore locale. Vai su Guida Setup per attivare l'AI completa.");
        } else {
          setResult(data);
          setUsedAI(true);
        }
      } else {
        const errData = await response.json().catch(() => null);
        if (errData?.error === "AI_NOT_CONFIGURED") {
          setError("AI non ancora configurata. Vai sulla Guida Setup per attivare la chiave API Anthropic.");
        } else {
          setError("Analisi non disponibile al momento. Riprova piu tardi.");
        }
        setUsedAI(false);
      }
    } catch {
      // Network error - fall back to local engine
      const vitignoKey = vitigno === "Tutti i vitigni" ? "tutti" : vitigno;
      const localResult = generateLocalClimate(vitignoKey, scenario);
      setResult(localResult);
      setUsedAI(false);
      setError("Connessione al server AI non disponibile. Mostro risultati del motore locale.");
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
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <EngineToggle useAI={useAI} onChange={setUseAI} hasCode={!!getStoredCode()} />
            {usedAI && <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI Anthropic</span>}
            {result && !usedAI && <span className="text-xs text-bordeaux-400 flex items-center gap-1">Motore locale</span>}
          </div>
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
              <Link to="/admin" className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bordeaux-800 text-cream-50 text-xs font-medium hover:bg-bordeaux-700 transition-colors">
                <KeyRound className="w-3.5 h-3.5" /> Guida Setup
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

function generateLocalClimate(vitigno: string, scenario: string): ClimateResult {
  const vitigni = vitigno === "tutti"
    ? ["Pinot Nero", "Croatina (Bonarda)", "Barbera", "Riesling", "Moscato", "Ughetta di Canneto", "Buttafuoco"]
    : [vitigno];

  const vitignoData: Record<string, {gelate: string; caldo: string; grandine: string; resilienza: number; fenologia: string; aroma: string; adattamenti: string[]}> = {
    "Pinot Nero": {
      gelate: "critico", caldo: "alto", grandine: "alto", resilienza: 35,
      fenologia: "Germogliamento 20-25 marzo, vendemmia fine agosto. Anticipazione di 7-10 giorni rispetto al 2010.",
      aroma: "Il Pinot Nero perde i suoi aromi delicati di ciliegia, rosa e underbrush quando le temperature notturne superano i 18°C in agosto. La sintesi dei tannini della buccia risulta incompleta con vendemmie anticipate.",
      adattamenti: ["Potatura ritardata (double Guyot) per slittare il germogliamento di 10-15 giorni", "Impianto di wind machine nei vigneti sotto 350m per difesa antibrina", "Irrigazione di soccorso: 25-30L/pianta durante heat wave >35°C", "Selezione clonale dei biotipi Dijon 115 e 777, piu tolleranti al caldo"],
    },
    "Croatina (Bonarda)": {
      gelate: "medio", caldo: "medio", grandine: "medio", resilienza: 68,
      fenologia: "Germogliamento inizio aprile, vendemmia metà settembre. Ciclo medio-tardivo che riduce esposizione a gelate.",
      aroma: "Croatina mantiene buon profilo aromatico (frutto rosso, spezie) anche con temperature moderate. Rischio principale: eccesso di vigoria con piogge primaverili che diluiscono le antociani.",
      adattamenti: ["Gestione chioma: defogliatura precoce per aerare i grappoli", "Drenaggio del suolo per prevenire marciumi in anni piovosi", "Diradamento grappoli al 60% per equilibrare vigoria e qualità"],
    },
    "Barbera": {
      gelate: "medio", caldo: "medio", grandine: "medio", resilienza: 72,
      fenologia: "Germogliamento 5-10 aprile, vendemmia metà settembre. Adattabilita fenologica eccellente.",
      aroma: "Barbera beneficia del riscaldamento moderato: migliore maturazione fenolica, ma attenzione all'acidita tartarica che cala con temperature >32°C. Vini piu rotondi ma meno freschi.",
      adattamenti: ["Diradamento al 50% per mantenere concentrazione e acidita", "Gestione dell'acqua: inerbimento controllato per regolare vigoria", "Vendemmia anticipata di 3-5 giorni per preservare acidita fissata"],
    },
    "Riesling": {
      gelate: "alto", caldo: "alto", grandine: "medio", resilienza: 52,
      fenologia: "Germogliamento 25-30 marzo, vendemmia prima decade di ottobre. Vitigno tardivo che beneficia di escursione termica.",
      aroma: "Riesling perde la sua eleganza minerale e gli aromi di mela verde, idrocarburo e agrumi quando la temperatura media di settembre supera 20°C. La degradazione dell'acidita malica e accelerata del 30%.",
      adattamenti: ["Spostamento verso quote >450m per preservare escursione termica notturna", "Coperture antibrina fisse nei vigneti esposti a ristagno aria fredda", "Monitoraggio stress idrico con sonde TDR a 60cm", "Vendemmia selettiva: prima passata per acidita, seconda per aromaticita"],
    },
    "Moscato": {
      gelate: "alto", caldo: "medio", grandine: "alto", resilienza: 48,
      fenologia: "Germogliamento 25 marzo, vendemmia fine agosto. Ciclo precoce che aumenta l'esposizione a gelate tardive.",
      aroma: "Moscato perde i terpeni liberi (linalolo, geraniolo) con temperature >30°C di notte. Il profumo aromatico si appiattisce e la freschezza cede il posto a note di confettura.",
      adattamenti: ["Raccolta anticipata alla fine di agosto per mantenere freschezza aromatica", "Esposizione est-ovest per ridurre insolazione diretta sui grappoli", "Reti antigrandine obbligatorie per protezione del prodotto"],
    },
    "Ughetta di Canneto": {
      gelate: "medio", caldo: "basso", grandine: "medio", resilienza: 78,
      fenologia: "Germogliamento 5 aprile, vendemmia metà settembre. Vitigno autoctono rustico con ciclo equilibrato.",
      aroma: "Ughetta mantiene il suo profilo aromatico unico (pepe nero, frutti di bosco, viola) anche in condizioni di riscaldamento. Buona tolleranza allo stress idrico grazie a radici profonde.",
      adattamenti: ["Recupero clonale per adattamento genetico al territorio", "Conservazione della biodiversita locale tramite banche del germoplasma", "Gestione tradizionale della chioma: allevamento a Guyot tradizionale"],
    },
    "Buttafuoco": {
      gelate: "medio", caldo: "medio", grandine: "medio", resilienza: 75,
      fenologia: "Germogliamento 1-5 aprile, vendemmia prima decade di ottobre. Vitigno storico con buona rusticità.",
      aroma: "Buttafuoco mostra eccellente stabilita del profilo aromatico (ciliegia nera, spezie, cuoio) anche con riscaldamento moderato. La struttura tannica si mantiene equilibrata.",
      adattamenti: ["Recupero clonale per adattamento genetico", "Gestione tradizionale della chioma con potatura Guyot", "Difesa fitosanitaria integrata per patogeni emergenti favoriti dal caldo"],
    },
  };

  const rischi = vitigni.map((v) => {
    const data = vitignoData[v] || vitignoData["Barbera"];
    return [
      {
        vitigno: v,
        rischio: "Gelate primaverili tardive (aprile-maggio)",
        livello: data.gelate,
        periodo: "Aprile-Maggio",
        dettaglio: `Bruschi abbassamenti sotto 0°C durante il germogliamento. ${data.fenologia} ${data.gelate === "critico" ? "Altissima vulnerabilita: perdita fino al 60% del raccolto in anni sfavorevoli." : data.gelate === "alto" ? "Sensibilita marcata, necessarie coperture antibrina." : "Tolleranza moderata, danni localizzati in fondovalle."}`,
      },
      {
        vitigno: v,
        rischio: "Ondate di calore estive (>35°C)",
        livello: data.caldo,
        periodo: "Luglio-Agosto",
        dettaglio: `${data.aroma} Temperature >35°C per 5+ giorni bloccano la fotosintesi e alterano la maturazione fenolica.`,
      },
      {
        vitigno: v,
        rischio: "Eventi grandinari estivi",
        livello: data.grandine,
        periodo: "Giugno-Settembre",
        dettaglio: `Frequenza degli eventi grandinari in aumento del 15% nel decennio 2015-2025 rispetto al precedente. Danni a grappoli e chioma con perdite fino al 40% in vigneti non protetti.`,
      },
    ];
  }).flat();

  const vitigniAnalizzati = vitigni.map((v) => vitignoData[v] || vitignoData["Barbera"]);

  const adattamenti = [
    { pratica: "Potatura ritardata (late pruning)", descrizione: "Posticipare la potatura invernale di 2-3 settimane per ritardare il germogliamento e ridurre il rischio di gelate tardive del 40%.", priorita: "alta" },
    { pratica: "Irrigazione di precisione (drip irrigation)", descrizione: "Impianti a goccia con sonde TDR a 30/60/90cm. Erogazione mirata di 25-35L/pianta durante heat wave, solo quando il suolo raggiunge il 40% della capacita idrica.", priorita: "alta" },
    { pratica: "Gestione chioma e defogliatura bilanciata", descrizione: "Mantenere chioma equilibrata (15-18 germogli/m) per proteggere i grappoli da scottature e migliorare aerazione, riducendo pressioni fungine del 30%.", priorita: "media" },
    { pratica: "Coperture antibrina (teli TNT + wind machine)", descrizione: "Teli TNT nei vigneti sotto 350m, wind machine nelle aree di ristagno aria fredda. Investimento 8-15K€/ha, ammortizzabile in 3-5 anni.", priorita: "media" },
    { pratica: "Reti antigrandine", descrizione: "Copertura dei vigneti piu esposti. Investimento 5-8K€/ha, riduzione danni del 90%. Frequenza eventi in aumento ne giustifica l'investimento.", priorita: "media" },
    { pratica: "Inerbimento permanente e cover crop", descrizione: "Mantenere cotica erbosa con trifoglio e veccia per migliorare ritenzione idrica del suolo (+20%) e ridurre erosione durante piogge intense.", priorita: "bassa" },
    ...vitigniAnalizzati.flatMap((d) => d.adattamenti.map((a) => ({ pratica: a.split(" ").slice(0, 4).join(" "), descrizione: a, priorita: d.resilienza < 50 ? "alta" : "media" }))),
  ];

  const proiezioni = [
    { orizzonte: "5 anni (2026-2031)", scenario: "Riscaldamento moderato — RCP 4.5", temperatura_media: "+0.8°C (media annua 13.5°C → 14.3°C)", precipitazioni: "-5% annue, piogge estive -18%, eventi intensi +12%", impatto_vitigni: "Anticipazione fenologica di 7-10 giorni. Germogliamento piu precoce aumenta l'esposizione alle gelate tardive. Pinot Nero e Riesling a rischio sotto 400m. Barbera e Croatina beneficiano parzialmente del clima piu caldo." },
    { orizzonte: "10 anni (2026-2036)", scenario: "Riscaldamento accelerato — RCP 6.0", temperatura_media: "+1.5°C (media annua 13.5°C → 15.0°C)", precipitazioni: "-10% annue, stagione secca estesa 40-50 giorni, eventi estremi +25%", impatto_vitigni: "Pinot Nero abbandonabile sotto 450m senza irrigazione. Riesling solo sopra 550m. Barbera diventa il vitigno rosso di riferimento. Moscato perde freschezza aromatica senza gestione accurata. Ughetta e Buttafuoco emergono come vitigni strategici." },
    { orizzonte: "20 anni (2026-2046)", scenario: "Clima sub-mediterraneo — RCP 8.5", temperatura_media: "+2.5°C (media annua 13.5°C → 16.0°C)", precipitazioni: "-15% annue, stagione secca 60-80 giorni, piogge concentrate autunnali", impatto_vitigni: "Trasformazione profonda del paesaggio viticolo. Pinot Nero residuale solo sopra 600m con irrigazione. Riesling sostituito da varita piu tolleranti. Ughetta, Buttafuoco e Barbera diventano i pilastri dell'Oltrepò. Possibile introduzione di vitigni meridionali (Nero d'Avola, Montepulciano) in quote basse." },
  ];

  const allResilienti = Object.entries(vitignoData).map(([nome, d]) => ({ vitigno: nome, motivazione: d.resilienza >= 70 ? `Vitigno rustico con eccellente tolleranza agli stress climatici. ${nome === "Ughetta di Canneto" ? "Autoctono locale con patrimonio genetico adattato al territorio da secoli." : "Buona adattabilita termica e idrica."}` : d.resilienza >= 50 ? `Tolleranza moderata agli stress. Richiede attenzioni agronomiche ma mantenibile con pratiche di adattamento.` : `Elevata vulnerabilita ai cambiamenti climatici. Valutare progressivo sostegno con vitigni piu resilienti o spostamento verso quote elevate.`, score_resilienza: d.resilienza })).sort((a, b) => b.score_resilienza - a.score_resilienza);

  const vitigni_resilienti = allResilienti.slice(0, 5);

  const monitoraggio = [
    "Stazione meteo in vigneto: temperatura, umidita, pioggia, vento, radiazione solare — data logging ogni 15 min",
    "Sonde TDR a 3 profondita (30/60/90cm) per gestione irrigazione di precisione",
    "Sensori di temperatura a 3 livelli (suolo, chioma, 2m) per allerta gelate a 72h",
    "Monitoraggio fenologico con Sentinel-2: germogliamento, fioritura, invaiatura, vendemmia",
    "Registro storico date fenologiche per trend analysis e anticipazione climatica",
    "Analisi maturazione settimanale da invaiatura: zuccheri (Babo), acidita (tartarica+malica), pH, antociani, tannini buccia",
    "Profumo analitico: gascromatografia per terpeni (Moscato) e norisoprenoidi (Riesling, Pinot Nero)",
    "Mappatura suoli con elettroresistivita per identificare zone a rischio stress idrico",
  ];

  const vitignoNome = vitigno === "tutti" ? "tutti i vitigni dell'Oltrepò Pavese" : vitigno;
  const sintesi = `Analisi climatica per ${vitignoNome} nell'Oltrepò Pavese (45° parallelo, 300-700m slm). ${scenario ? `Scenario specifico considerato: "${scenario}". ` : ""}Il territorio sperimenta un riscaldamento progressivo: +0.8°C proiettati a 5 anni, +2.5°C al 2046. Le precipitazioni estive diminuiscono del 18% mentre gli eventi estremi aumentano del 12%. ${vitigniAnalizzati.some((d) => d.gelate === "critico" || d.gelate === "alto") ? "Le gelate primaverili rappresentano il rischio piu immediato: il germogliamento anticipato aumenta drammaticamente l'esposizione." : ""} I vitigni autoctoni rustici (${allResilienti.filter((v) => v.score_resilienza >= 70).map((v) => v.vitigno).join(", ")}) mostrano la miglior resilienza climatica e dovrebbero essere valorizzati come asset strategici per il futuro del territorio. L'implementazione di irrigazione di precisione, potatura ritardata e reti antigrandine e prioritaria. La transizione climatica richiede un ripensamento del vitignato: il Pinot Nero, bandiera dell'Oltrepò, sara progressivamente sostituito nelle quote basse da vitigni piu adattabili.`;

  return { rischi_climatici: rischi, adattamenti, proiezioni, vitigni_resilienti, monitoraggio, sintesi };
}
