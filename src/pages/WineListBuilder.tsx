import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sparkles, Download, Wine as WineIcon, Check, X, ArrowRight, Info } from "lucide-react";
import { loadWineCatalog } from "../data/wineCatalog";
import { pairDishWithCatalog } from "../lib/pairingEngine";
import type { Wine, PairingResult } from "../types/wine";

interface DishPairing {
  dish: string;
  pairings: PairingResult[];
  selected: PairingResult | null;
}

const SAMPLE_MENU = `Antipasto: Tartare di manzo
Primo: Risotto ai funghi porcini
Secondo: Ossobuco con polenta
Dessert: Tiramisu`;

export default function WineListBuilder() {
  const [catalog, setCatalog] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuText, setMenuText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<DishPairing[]>([]);
  const [generated, setGenerated] = useState(false);
  const [targetMargin, setTargetMargin] = useState(50);

  useEffect(() => {
    loadWineCatalog().then((cat) => {
      setCatalog(cat);
      setLoading(false);
    });
  }, []);

  const saleWines = useMemo(() => catalog.filter((w) => !w.demo), [catalog]);

  const handleGenerate = () => {
    if (!menuText.trim()) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      const dishes = menuText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 2);
      const dishPairings: DishPairing[] = dishes.map((dish) => {
        const cleanDish = dish.replace(/^(Antipasto|Primo|Secondo|Dessert|Contorno)\s*:?\s*/i, "").trim();
        const pairings = pairDishWithCatalog(saleWines, cleanDish, undefined, "ristoratore");
        return { dish: cleanDish, pairings, selected: pairings[0] || null };
      });
      setResults(dishPairings);
      setGenerating(false);
      setGenerated(true);
    }, 800);
  };

  const selectWine = (dishIdx: number, pairingIdx: number) => {
    setResults((prev) =>
      prev.map((dp, i) =>
        i === dishIdx ? { ...dp, selected: dp.pairings[pairingIdx] } : dp
      )
    );
  };

  const suggestedPrice = (wine: Wine) => {
    const margin = wine.fascia === "economico" ? 60 : wine.fascia === "standard" ? 50 : wine.fascia === "premium" ? 40 : 35;
    return (wine.prezzo / (1 - margin / 100)).toFixed(2);
  };

  const totalListValue = results
    .filter((r) => r.selected)
    .reduce((sum, r) => sum + r.selected!.wine.prezzo, 0);

  const totalSuggestedRevenue = results
    .filter((r) => r.selected)
    .reduce((sum, r) => sum + parseFloat(suggestedPrice(r.selected!.wine)), 0);

  const handleDownload = () => {
    const lines = ["CARTA DEI VINI — BF45 AI Wine List Builder\n"];
    results.filter((r) => r.selected).forEach((r) => {
      const w = r.selected!.wine;
      lines.push(`Piatto: ${r.dish}`);
      lines.push(`  Vino: ${w.nome}`);
      lines.push(`  Regione: ${w.regione}`);
      lines.push(`  Tipo: ${w.tipo} — ${w.uva}`);
      lines.push(`  Prezzo acquisto: EUR ${w.prezzo.toFixed(2)}`);
      lines.push(`  Prezzo suggerito in carta: EUR ${suggestedPrice(w)}`);
      lines.push(`  Score abbinamento: ${r.selected!.score.totale}/100`);
      lines.push(`  Motivo: ${r.selected!.motivo_abbinamento}`);
      lines.push("");
    });
    lines.push(`Costo totale cantina: EUR ${totalListValue.toFixed(2)}`);
    lines.push(`Ricavo stimato: EUR ${totalSuggestedRevenue.toFixed(2)}`);
    lines.push(`Margine medio: ${((1 - totalListValue / totalSuggestedRevenue) * 100).toFixed(0)}%`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "carta-vini-bf45.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bordeaux-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> BF45 Business
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">Carta dei Vini AI</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">
            Incolla il tuo menu. L'AI analizza ogni piatto e costruisce una carta dei vini completa
            con abbinamenti, prezzi di vendita suggeriti e margini.
          </p>
        </div>

        {!generated && !generating && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-bordeaux-700 mb-2 block">Il tuo menu</label>
              <textarea
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
                placeholder={SAMPLE_MENU}
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
              />
              <button
                onClick={() => setMenuText(SAMPLE_MENU)}
                className="text-xs text-bordeaux-500 hover:text-gold-600 mt-1"
              >
                Usa menu di esempio
              </button>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-cream-50 border border-cream-200">
              <label className="text-sm font-medium text-bordeaux-700 shrink-0">Margine target:</label>
              <input
                type="range"
                min={30}
                max={70}
                value={targetMargin}
                onChange={(e) => setTargetMargin(Number(e.target.value))}
                className="flex-1 accent-bordeaux-700"
              />
              <span className="text-sm font-semibold text-bordeaux-950 w-12 text-right">{targetMargin}%</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!menuText.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" /> Genera carta dei vini
            </button>

            <div className="p-4 rounded-xl bg-gold-50 border border-gold-200">
              <p className="text-xs text-bordeaux-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <span>
                  L'AI usa il motore IRC (4 dimensioni: chimica, aromatico, struttura, pulizia) per
                  abbinare ogni piatto al vino perfetto. Suggerisce automaticamente il prezzo di
                  vendita in base al margine target e alla fascia del vino. Funziona solo con i vini
                  in vendita dell'Oltrepò Pavese.
                </span>
              </p>
            </div>
          </div>
        )}

        {generating && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-bordeaux-600 mx-auto mb-4" />
            <p className="text-sm text-bordeaux-500">Analisi del menu in corso...</p>
          </div>
        )}

        {generated && !generating && (
          <div className="space-y-6">
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-bordeaux-950 rounded-xl p-4 text-center">
                <p className="text-xs text-gold-400 uppercase tracking-wider mb-1">Piatti analizzati</p>
                <p className="font-serif text-2xl text-cream-50">{results.length}</p>
              </div>
              <div className="bg-bordeaux-950 rounded-xl p-4 text-center">
                <p className="text-xs text-gold-400 uppercase tracking-wider mb-1">Costo cantina</p>
                <p className="font-serif text-2xl text-cream-50">€{totalListValue.toFixed(2)}</p>
              </div>
              <div className="bg-bordeaux-950 rounded-xl p-4 text-center">
                <p className="text-xs text-gold-400 uppercase tracking-wider mb-1">Ricavo stimato</p>
                <p className="font-serif text-2xl text-gold-400">€{totalSuggestedRevenue.toFixed(2)}</p>
              </div>
            </div>

            {/* Per-dish results */}
            {results.map((dp, dishIdx) => (
              <div key={dishIdx} className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden">
                <div className="bg-bordeaux-50 px-5 py-3 border-b border-cream-200 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-bordeaux-800 text-gold-400 text-xs font-bold flex items-center justify-center">
                    {dishIdx + 1}
                  </span>
                  <h3 className="font-serif text-lg text-bordeaux-950">{dp.dish}</h3>
                </div>

                <div className="p-4 space-y-2">
                  {dp.pairings.slice(0, 3).map((p, pIdx) => {
                    const isSelected = dp.selected === p;
                    return (
                      <div
                        key={pIdx}
                        onClick={() => selectWine(dishIdx, pIdx)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? "bg-gold-50 border-2 border-gold-400" : "bg-cream-100 border-2 border-transparent hover:bg-cream-200"
                        }`}
                      >
                        <div className="flex flex-col items-center shrink-0 w-14">
                          <p className={`font-serif text-xl ${p.score.totale >= 80 ? "text-green-600" : p.score.totale >= 60 ? "text-gold-600" : "text-bordeaux-500"}`}>
                            {p.score.totale}
                          </p>
                          <p className="text-[10px] text-bordeaux-400">/100</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link to={`/wine/${p.wine.id}`} className="font-medium text-sm text-bordeaux-950 hover:text-bordeaux-700 truncate">
                              {p.wine.nome}
                            </Link>
                            {isSelected && <Check className="w-4 h-4 text-green-600 shrink-0" />}
                          </div>
                          <p className="text-xs text-bordeaux-500 mt-0.5">
                            {p.wine.tipo} · {p.wine.uva} · {p.wine.regione}
                          </p>
                          <p className="text-xs text-bordeaux-600 mt-1 line-clamp-1">{p.motivo_abbinamento}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-bordeaux-400">Costo €{p.wine.prezzo.toFixed(2)}</p>
                          <p className="text-sm font-semibold text-bordeaux-800">In carta €{suggestedPrice(p.wine)}</p>
                          <p className="text-xs text-green-600">+{Math.round((1 - p.wine.prezzo / parseFloat(suggestedPrice(p.wine))) * 100)}% margine</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {dp.selected && (
                  <div className="px-5 py-3 bg-bordeaux-50 border-t border-cream-200">
                    <p className="text-xs text-bordeaux-600">
                      <span className="font-semibold">Consigli per la sala:</span> {dp.selected.consigli_culinari}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Scarica carta dei vini
              </button>
              <button
                onClick={() => { setGenerated(false); setResults([]); }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cream-200 text-bordeaux-700 font-semibold hover:bg-cream-300 transition-colors text-sm"
              >
                <X className="w-4 h-4" /> Nuovo menu
              </button>
              <Link
                to="/catalog?regione=Oltrepò+Pavese"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cream-100 text-bordeaux-600 font-medium hover:bg-cream-200 transition-colors text-sm"
              >
                <WineIcon className="w-4 h-4" /> Esplora cantina <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
