import { useEffect, useState } from "react";
import { Beaker, ArrowLeft, SlidersHorizontal, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import { pairDishWithCatalog } from "../lib/pairingEngine";
import type { PairingResult, Wine } from "../types/wine";

export default function WineLab() {
  const navigate = useNavigate();
  const { t, searchHistory } = useApp();
  const [catalog, setCatalog] = useState<Wine[]>([]);
  const [dish, setDish] = useState(searchHistory[0]?.piatto || "risotto ai funghi");
  const [fat, setFat] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const [spice, setSpice] = useState(20);
  const [result, setResult] = useState<PairingResult | null>(null);

  useEffect(() => { loadWineCatalog().then(setCatalog); }, []);
  useEffect(() => { if (catalog.length) setResult(pairDishWithCatalog(catalog, `${dish}, intensità ${intensity}%, grassezza ${fat}%, speziatura ${spice}%`)[0] || null); }, [catalog, dish, fat, intensity, spice]);

  const reset = () => { setFat(50); setIntensity(50); setSpice(20); };
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14"><button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-8"><ArrowLeft className="w-4 h-4" /> {t("nav.home")}</button><div className="max-w-3xl mb-8"><div className="flex items-center gap-3 mb-3"><Beaker className="w-7 h-7 text-gold-600" /><p className="text-xs uppercase tracking-[0.2em] text-gold-600">Wine Lab</p></div><h1 className="font-serif text-4xl text-bordeaux-950">Il laboratorio del gusto</h1><p className="text-bordeaux-600 mt-3 leading-relaxed">Prendi l'ultimo piatto cercato, modificalo con gli slider e guarda come cambia l'abbinamento. La stessa analisi molecolare del motore Bwine, applicata alla variante del piatto.</p></div><div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6"><section className="p-6 rounded-2xl bg-cream-100 border border-cream-200"><label className="text-xs text-bordeaux-600 block mb-1">Piatto da modificare</label><textarea value={dish} onChange={(e) => setDish(e.target.value)} rows={3} className="w-full px-3 py-3 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" /><div className="mt-7 space-y-6"><Slider label="Grassezza" value={fat} onChange={setFat} low="Leggero" high="Ricco" /><Slider label="Intensità" value={intensity} onChange={setIntensity} low="Delicato" high="Potente" /><Slider label="Speziatura" value={spice} onChange={setSpice} low="Pulito" high="Piccante" /></div><button onClick={reset} className="mt-7 flex items-center gap-2 text-sm text-bordeaux-600 hover:text-gold-600"><RefreshCw className="w-4 h-4" /> Ripristina variante</button></section><section className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100 min-h-[360px]"><div className="flex items-center gap-2 mb-5"><SlidersHorizontal className="w-5 h-5 text-gold-400" /><h2 className="font-serif text-xl text-cream-50">Abbinamento aggiornato</h2></div>{result ? <><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-gold-400 uppercase tracking-wider">Miglior risultato</p><h3 className="font-serif text-2xl text-cream-50 mt-1">{result.wine.nome}</h3><p className="text-sm text-cream-300 mt-1">{result.wine.regione} · {result.wine.tipo}</p></div><span className="text-3xl font-serif text-gold-400">{result.score.totale}</span></div><div className="grid grid-cols-2 gap-3 mt-7">{[["Chimica", result.score.chimica, 40], ["Aromaticità", result.score.aromatico, 25], ["Struttura", result.score.struttura, 20], ["Pulizia", result.score.pulizia, 15]].map(([label, value, max]) => <div key={label as string}><div className="flex justify-between text-xs text-cream-300"><span>{label}</span><span>{value}/{max}</span></div><div className="h-2 rounded-full bg-bordeaux-800 mt-1"><div className="h-2 rounded-full bg-gold-400 transition-all" style={{ width: `${(Number(value) / Number(max)) * 100}%` }} /></div></div>)}</div><p className="text-sm text-cream-200 mt-7 leading-relaxed">{result.meccanismo_chimico}</p><button onClick={() => navigate(`/wine/${result.wine.id}`)} className="mt-5 text-sm text-gold-400 hover:text-gold-300">Vedi scheda del vino →</button></> : <p className="text-cream-300">Caricamento analisi...</p>}</section></div></div>;
}

function Slider({ label, value, onChange, low, high }: { label: string; value: number; onChange: (value: number) => void; low: string; high: string }) { return <div><div className="flex justify-between text-sm text-bordeaux-800 mb-2"><span>{label}</span><span className="font-semibold">{value}%</span></div><input type="range" min="0" max="100" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-bordeaux-700" /><div className="flex justify-between text-xs text-bordeaux-500 mt-1"><span>{low}</span><span>{high}</span></div></div>; }
