import { useEffect, useState } from "react";
import { Beaker, ArrowLeft, SlidersHorizontal, RefreshCw, Sparkles, Wine as WineIcon, MapPin, Grape, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import { pairDishWithCatalog } from "../lib/pairingEngine";
import type { PairingResult, Wine } from "../types/wine";

const FASCIE_INFO: Record<string, { range: string; desc: string }> = {
  economico: { range: "€8 – €15", desc: "Vini di tutti i giorni, ottimo rapporto qualità-prezzo" },
  standard: { range: "€15 – €30", desc: "Vini affidabili per occasioni regolari" },
  premium: { range: "€30 – €70", desc: "Vini di qualità superiore, per momenti speciali" },
  lusso: { range: "€70 – €200+", desc: "Grandi bottiglie, etichette prestigiose e annate eccezionali" },
};

export default function WineLab() {
  const navigate = useNavigate();
  const { t, searchHistory } = useApp();
  const [catalog, setCatalog] = useState<Wine[]>([]);
  const [dish, setDish] = useState(searchHistory[0]?.piatto || "risotto ai funghi");
  const [fat, setFat] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const [spice, setSpice] = useState(20);
  const [aiNote, setAiNote] = useState("");
  const [result, setResult] = useState<PairingResult | null>(null);

  useEffect(() => { loadWineCatalog().then(setCatalog); }, []);

  useEffect(() => {
    if (!catalog.length) return;
    const modifiers: string[] = [];
    if (fat !== 50) modifiers.push(`grassezza ${fat}%`);
    if (intensity !== 50) modifiers.push(`intensità ${intensity}%`);
    if (spice !== 20) modifiers.push(`speziatura ${spice}%`);
    if (aiNote.trim()) modifiers.push(aiNote.trim());
    const fullDish = modifiers.length ? `${dish}, ${modifiers.join(", ")}` : dish;
    setResult(pairDishWithCatalog(catalog, fullDish)[0] || null);
  }, [catalog, dish, fat, intensity, spice, aiNote]);

  const reset = () => { setFat(50); setIntensity(50); setSpice(20); setAiNote(""); };

  const w = result?.wine;
  const fasciaInfo = w ? FASCIE_INFO[w.fascia] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> {t("nav.home")}
      </button>

      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Beaker className="w-7 h-7 text-gold-600" />
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600">Wine Lab</p>
        </div>
        <h1 className="font-serif text-4xl text-bordeaux-950">Il laboratorio del gusto</h1>
        <p className="text-bordeaux-600 mt-3 leading-relaxed">
          Prendi l'ultimo piatto cercato (o scrivine uno nuovo), modificalo con gli slider qui sotto e guarda come cambia l'abbinamento —
          stessa analisi molecolare del motore Bwine, applicata alla variante del piatto.
          Utile anche per un ristorante che vuole testare una variazione di ricetta prima di metterla in carta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
        {/* Left: Controls */}
        <section className="p-6 rounded-2xl bg-cream-100 border border-cream-200">
          <label className="text-xs text-bordeaux-600 block mb-1">Piatto da modificare</label>
          <textarea value={dish} onChange={(e) => setDish(e.target.value)} rows={2}
            className="w-full px-3 py-3 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />

          <div className="mt-6 space-y-5">
            <Slider label="Grassezza" value={fat} onChange={setFat} low="Leggero" high="Ricco" />
            <Slider label="Intensità" value={intensity} onChange={setIntensity} low="Delicato" high="Potente" />
            <Slider label="Speziatura" value={spice} onChange={setSpice} low="Pulito" high="Piccante" />
          </div>

          {/* AI text input */}
          <div className="mt-6 p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <p className="text-xs font-semibold text-bordeaux-800">Oppure scrivi tu la modifica</p>
            </div>
            <p className="text-xs text-bordeaux-500 mb-2 leading-relaxed">
              Pensato per lo staff di cucina: descrivi a parole libere come vuoi modificare la ricetta
              (es. "tolgo il burro e uso olio EVO, aggiungo scorza di limone") e l'AI la considera insieme agli slider.
            </p>
            <textarea value={aiNote} onChange={(e) => setAiNote(e.target.value)} rows={2}
              placeholder="es. tolgo il burro, aggiungo scorza di limone..."
              className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>

          <button onClick={reset} className="mt-6 flex items-center gap-2 text-sm text-bordeaux-600 hover:text-gold-600">
            <RefreshCw className="w-4 h-4" /> Ripristina variante
          </button>
        </section>

        {/* Right: Results */}
        <section className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100 min-h-[400px]">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-5 h-5 text-gold-400" />
            <h2 className="font-serif text-xl text-cream-50">Abbinamento aggiornato</h2>
          </div>

          {result && w ? (
            <>
              {/* Wine name + score */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gold-400 uppercase tracking-wider">Miglior risultato</p>
                  <h3 className="font-serif text-2xl text-cream-50 mt-1">{w.nome}</h3>
                  <p className="text-sm text-cream-300 mt-1">{w.regione} · {w.continente}</p>
                </div>
                <span className="text-4xl font-serif text-gold-400">{result.score.totale}</span>
              </div>

              {/* Wine indicators */}
              <div className="grid grid-cols-2 gap-2 mt-5">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-bordeaux-800/50">
                  <WineIcon className="w-4 h-4 text-gold-400" />
                  <div>
                    <p className="text-[10px] text-cream-400 uppercase">Tipo</p>
                    <p className="text-xs text-cream-100">{w.tipo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-bordeaux-800/50">
                  <Grape className="w-4 h-4 text-gold-400" />
                  <div>
                    <p className="text-[10px] text-cream-400 uppercase">Uva</p>
                    <p className="text-xs text-cream-100">{w.uva}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-bordeaux-800/50">
                  <Percent className="w-4 h-4 text-gold-400" />
                  <div>
                    <p className="text-[10px] text-cream-400 uppercase">Alcol</p>
                    <p className="text-xs text-cream-100">{w.alcol}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-bordeaux-800/50">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <div>
                    <p className="text-[10px] text-cream-400 uppercase">Fascia</p>
                    <p className="text-xs text-cream-100">{w.fascia} · €{w.prezzo.toFixed(0)}</p>
                  </div>
                </div>
              </div>

              {/* Chemical indicators */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Indicator label="Acidità" value={w.acidita} />
                <Indicator label="Tannini" value={w.tannini} />
                <Indicator label="Corpo" value={w.corpo} />
                <Indicator label="Zuccheri" value={w.residuo_zuccherino > 50 ? "Dolce" : w.residuo_zuccherino > 10 ? "Abboccato" : "Secco"} />
              </div>

              {/* Aromatic profile */}
              <div className="mt-4">
                <p className="text-[10px] text-cream-400 uppercase mb-1.5">Profili aromatici</p>
                <div className="flex flex-wrap gap-1.5">
                  {w.profilo_aromatico.map((a) => (
                    <span key={a} className="text-[10px] px-2 py-1 rounded-full bg-bordeaux-800/60 text-cream-200 border border-gold-700/20">{a}</span>
                  ))}
                </div>
              </div>

              {/* Pairs with */}
              <div className="mt-3">
                <p className="text-[10px] text-cream-400 uppercase mb-1.5">Abbinato a</p>
                <div className="flex flex-wrap gap-1.5">
                  {w.abbina_bene_con.slice(0, 4).map((a) => (
                    <span key={a} className="text-[10px] px-2 py-1 rounded-full bg-gold-700/30 text-gold-200">🍽️ {a}</span>
                  ))}
                </div>
              </div>

              {/* IRC Score bars */}
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-bordeaux-800">
                {[["Chimica", result.score.chimica, 40], ["Aromaticità", result.score.aromatico, 25], ["Struttura", result.score.struttura, 20], ["Pulizia", result.score.pulizia, 15]].map(([label, value, max]) => (
                  <div key={label as string}>
                    <div className="flex justify-between text-xs text-cream-300">
                      <span>{label}</span>
                      <span>{value}/{max}</span>
                    </div>
                    <div className="h-2 rounded-full bg-bordeaux-800 mt-1">
                      <div className="h-2 rounded-full bg-gold-400 transition-all duration-500" style={{ width: `${(Number(value) / Number(max)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mechanism explanation */}
              <p className="text-sm text-cream-200 mt-5 leading-relaxed">{result.meccanismo_chimico}</p>

              {/* Price range info */}
              {fasciaInfo && (
                <div className="mt-4 p-3 rounded-lg bg-bordeaux-800/40 border border-gold-700/20">
                  <p className="text-xs text-gold-400 font-semibold">{w.fascia} — {fasciaInfo.range}</p>
                  <p className="text-xs text-cream-300 mt-0.5">{fasciaInfo.desc}</p>
                </div>
              )}

              <button onClick={() => navigate(`/wine/${w.id}`)} className="mt-5 text-sm text-gold-400 hover:text-gold-300">
                Vedi scheda completa del vino →
              </button>
            </>
          ) : (
            <p className="text-cream-300">Caricamento analisi...</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, low, high }: { label: string; value: number; onChange: (value: number) => void; low: string; high: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-bordeaux-800 mb-2">
        <span>{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-bordeaux-700" />
      <div className="flex justify-between text-xs text-bordeaux-500 mt-1">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

function Indicator({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-bordeaux-800/50">
      <p className="text-[10px] text-cream-400 uppercase">{label}</p>
      <p className="text-xs text-cream-100 mt-0.5 capitalize">{value}</p>
    </div>
  );
}
