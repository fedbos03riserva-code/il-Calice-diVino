import { useState } from "react";
import { Plus, Pencil, Trash2, Store, Sparkles, X, CheckCircle, AlertTriangle, Wine as WineIcon } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import { pairDishWithCatalog } from "../lib/pairingEngine";
import type { RestaurantWine as RWine, WineType } from "../types/wine";

const WINE_TYPES: WineType[] = ["Rosso", "Bianco", "Rosato", "Spumante", "Dolce"];
const ACIDITY_LEVELS = ["bassa", "media", "alta", "altissima"];
const TANNIN_LEVELS = ["assenti", "leggeri", "fini", "morbidi", "medi", "vellutati", "strutturati", "potenti", "titanici"];
const BODY_LEVELS = ["leggero", "leggero-medio", "medio", "medio-pieno", "pieno"];

interface AIResult {
  strengths: string[];
  weaknesses: string[];
  recommendations: { nome: string; motivo: string }[];
  menuAnalysis: string;
}

export default function RestaurantDashboard() {
  const { t, user, restaurantWines, addRestaurantWine, updateRestaurantWine, deleteRestaurantWine } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiText, setAiText] = useState("");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "", regione: "", tipo: "Rosso" as WineType, uva: "", alcol: 13,
    acidita: "media", tannini: "medi", corpo: "medio",
    profilo_aromatico: "", prezzo: 20, foto: "",
  });

  if (!user || user.role !== "ristoratore") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Store className="w-12 h-12 mx-auto mb-4 text-bordeaux-400" />
        <p className="text-bordeaux-600">Accesso riservato ai ristoratori.</p>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({ nome: "", regione: "", tipo: "Rosso", uva: "", alcol: 13, acidita: "media", tannini: "medi", corpo: "medio", profilo_aromatico: "", prezzo: 20, foto: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = formData.profilo_aromatico.split(",").map((s) => s.trim()).filter(Boolean);
    const wineData = { ...formData, profilo_aromatico: profile, foto: formData.foto || "" };
    if (editingId) {
      updateRestaurantWine(editingId, wineData);
    } else {
      addRestaurantWine(wineData);
    }
    resetForm();
  };

  const startEdit = (wine: RWine) => {
    setEditingId(wine.id);
    setFormData({
      nome: wine.nome, regione: wine.regione, tipo: wine.tipo, uva: wine.uva,
      alcol: wine.alcol, acidita: wine.acidita, tannini: wine.tannini, corpo: wine.corpo,
      profilo_aromatico: wine.profilo_aromatico.join(", "), prezzo: wine.prezzo, foto: wine.foto,
    });
    setShowForm(true);
  };

  const handleAiAnalyze = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    // Use the real pairing engine to analyze the menu text
    const catalog = await loadWineCatalog();
    const results = pairDishWithCatalog(catalog, aiText);

    // Analyze the restaurant's current wine list
    const myWineTypes = restaurantWines.map((w) => w.tipo);
    const hasRed = myWineTypes.includes("Rosso");
    const hasWhite = myWineTypes.includes("Bianco");
    const hasSparkling = myWineTypes.includes("Spumante");
    const hasSweet = myWineTypes.includes("Dolce");
    const hasRose = myWineTypes.includes("Rosato");

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (restaurantWines.length >= 10) strengths.push("Carta vini ben strutturata con buon numero di etichette.");
    else if (restaurantWines.length > 0) weaknesses.push("La carta vini è limitata. Si consiglia di ampliare la selezione.");
    else weaknesses.push("Nessun vino in carta. È fondamentale aggiungere almeno 8-10 etichette.");

    if (hasRed && hasWhite) strengths.push("Copertura equilibrata tra vini rossi e bianchi.");
    else {
      if (!hasRed) weaknesses.push("Assenza di vini rossi: indispensabili per carni e brasati.");
      if (!hasWhite) weaknesses.push("Assenza di vini bianchi: necessari per pesce e antipasti.");
    }
    if (!hasSparkling) weaknesses.push("Nessuno spumante in carta: consigliato per aperitivi e celebrazioni.");
    if (!hasSweet) weaknesses.push("Nessun vino dolce: utile per abbinamenti con dessert.");
    if (!hasRose) weaknesses.push("Nessun rosato: versatile per piatti intermedi e stagionali.");

    // Use top pairing results as recommendations
    const recommendations = results.slice(0, 5).map((r) => ({
      nome: r.wine.nome,
      motivo: `${r.motivo_abbinamento} (IRC: ${r.score.totale}/100)`,
    }));

    const menuAnalysis = `Il menu descritto ("${aiText.slice(0, 60)}${aiText.length > 60 ? "..." : ""}") è stato analizzato con il motore di abbinamento molecolare. Sono stati valutati ${catalog.length} vini del catalogo. I primi ${results.length} risultati mostrano un'affinità chimico-aromatica con i piatti descritti, con punteggi IRC da ${results[results.length - 1]?.score.totale || 0} a ${results[0]?.score.totale || 0} su 100.`;

    setTimeout(() => {
      setAiResult({ strengths, weaknesses, recommendations, menuAnalysis });
      setAiLoading(false);
    }, 800);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400";
  const labelClass = "text-xs text-bordeaux-600 block mb-1";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-bordeaux-800 flex items-center justify-center">
          <Store className="w-6 h-6 text-gold-400" />
        </div>
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-bordeaux-950">{t("restaurant.title")}</h1>
          <p className="text-sm text-bordeaux-600">{user.nome}</p>
        </div>
      </div>

      {/* My wines section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-bordeaux-950">{t("restaurant.myWines")} ({restaurantWines.length})</h2>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-gold-400 text-bordeaux-950 hover:bg-gold-300 transition-colors font-medium">
            <Plus className="w-4 h-4" /> {t("restaurant.addWine")}
          </button>
        </div>

        {/* Add/edit form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-5 rounded-xl bg-cream-100 border border-cream-200 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-bordeaux-950">{editingId ? t("restaurant.editWine") : t("restaurant.addWine")}</h3>
              <button type="button" onClick={resetForm} className="p-1 text-bordeaux-400 hover:text-bordeaux-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t("restaurant.wineName")}</label>
                <input type="text" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.wineRegion")}</label>
                <input type="text" required value={formData.regione} onChange={(e) => setFormData({ ...formData, regione: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.wineType")}</label>
                <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value as WineType })} className={inputClass}>
                  {WINE_TYPES.map((tp) => <option key={tp} value={tp}>{t(`type.${tp}`)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.wineGrape")}</label>
                <input type="text" required value={formData.uva} onChange={(e) => setFormData({ ...formData, uva: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.wineAlcohol")}</label>
                <input type="number" step="0.1" min="5" max="20" required value={formData.alcol} onChange={(e) => setFormData({ ...formData, alcol: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.winePrice")}</label>
                <input type="number" step="0.5" min="1" required value={formData.prezzo} onChange={(e) => setFormData({ ...formData, prezzo: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.wineAcidity")}</label>
                <select value={formData.acidita} onChange={(e) => setFormData({ ...formData, acidita: e.target.value })} className={inputClass}>
                  {ACIDITY_LEVELS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.wineTannins")}</label>
                <select value={formData.tannini} onChange={(e) => setFormData({ ...formData, tannini: e.target.value })} className={inputClass}>
                  {TANNIN_LEVELS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.wineBody")}</label>
                <select value={formData.corpo} onChange={(e) => setFormData({ ...formData, corpo: e.target.value })} className={inputClass}>
                  {BODY_LEVELS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("restaurant.winePhoto")}</label>
                <input type="text" value={formData.foto} onChange={(e) => setFormData({ ...formData, foto: e.target.value })} className={inputClass} placeholder="https://..." />
              </div>
            </div>
            <div className="mt-3">
              <label className={labelClass}>{t("restaurant.wineProfile")}</label>
              <input type="text" value={formData.profilo_aromatico} onChange={(e) => setFormData({ ...formData, profilo_aromatico: e.target.value })} className={inputClass} placeholder="ciliegia, spezie, vaniglia" />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-lg bg-cream-200 text-bordeaux-700 hover:bg-cream-300 transition-colors text-sm">{t("restaurant.cancel")}</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors text-sm">{t("restaurant.save")}</button>
            </div>
          </form>
        )}

        {/* Wine list */}
        {restaurantWines.length === 0 ? (
          <div className="p-8 rounded-xl bg-cream-50 border border-cream-200 text-center">
            <WineIcon className="w-10 h-10 mx-auto mb-3 text-bordeaux-300" />
            <p className="text-sm text-bordeaux-500">{t("restaurant.noWines")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {restaurantWines.map((wine) => (
              <div key={wine.id} className="flex items-center gap-3 p-3 rounded-lg bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors">
                <div className="w-8 h-16 rounded-t bg-bordeaux-700 shrink-0 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-3 bg-bordeaux-950 rounded-t" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-semibold text-bordeaux-950 line-clamp-1">{wine.nome}</h3>
                  <p className="text-xs text-bordeaux-600">{wine.regione} &middot; {t(`type.${wine.tipo}`)} &middot; {wine.uva}</p>
                  <p className="text-sm font-semibold text-bordeaux-800 mt-0.5">&euro;{wine.prezzo.toFixed(2)}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(wine)} className="p-2 rounded-lg bg-cream-200 hover:bg-cream-300 transition-colors">
                    <Pencil className="w-4 h-4 text-bordeaux-600" />
                  </button>
                  <button onClick={() => deleteRestaurantWine(wine.id)} className="p-2 rounded-lg bg-cream-200 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Consultation */}
      <div className="rounded-xl bg-cream-50 border border-cream-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-bordeaux-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold-400" />
          </div>
          <h2 className="font-serif text-xl text-bordeaux-950">{t("restaurant.aiConsult")}</h2>
        </div>

        <textarea
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
          placeholder={t("restaurant.aiPlaceholder")}
          rows={4}
          className={inputClass + " mb-3 resize-none"}
        />
        <button
          onClick={handleAiAnalyze}
          disabled={!aiText.trim() || aiLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-400 text-bordeaux-950 font-medium hover:bg-gold-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          <Sparkles className="w-4 h-4" /> {t("restaurant.aiAnalyze")}
        </button>

        {aiLoading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-bordeaux-500">
            <div className="w-4 h-4 border-2 border-bordeaux-300 border-t-bordeaux-700 rounded-full animate-spin" />
            Analisi in corso...
          </div>
        )}

        {aiResult && (
          <div className="mt-6 space-y-4 animate-fade-in">
            {/* Menu analysis */}
            <div className="p-4 rounded-lg bg-cream-100 border border-cream-200">
              <h3 className="font-serif text-base text-bordeaux-950 mb-2">{t("restaurant.aiMenuAnalysis")}</h3>
              <p className="text-sm text-bordeaux-600 text-pretty">{aiResult.menuAnalysis}</p>
            </div>

            {/* Strengths */}
            {aiResult.strengths.length > 0 && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h3 className="font-serif text-base text-green-800 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> {t("restaurant.aiStrengths")}
                </h3>
                <ul className="space-y-1">
                  {aiResult.strengths.map((s, i) => <li key={i} className="text-sm text-green-700 text-pretty">{s}</li>)}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {aiResult.weaknesses.length > 0 && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <h3 className="font-serif text-base text-amber-800 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> {t("restaurant.aiWeaknesses")}
                </h3>
                <ul className="space-y-1">
                  {aiResult.weaknesses.map((w, i) => <li key={i} className="text-sm text-amber-700 text-pretty">{w}</li>)}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {aiResult.recommendations.length > 0 && (
              <div className="p-4 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
                <h3 className="font-serif text-base text-bordeaux-800 mb-2">{t("restaurant.aiRecommendations")}</h3>
                <div className="space-y-2">
                  {aiResult.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-gold-600 mt-0.5">#{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-bordeaux-950">{r.nome}</p>
                        <p className="text-xs text-bordeaux-500 text-pretty">{r.motivo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
