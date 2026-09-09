import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChefHat, Search, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import type { Wine } from "../types/wine";

const INGREDIENTS = ["carne rossa", "pesce", "funghi", "formaggi", "pasta", "verdure", "dessert", "frutti di mare", "salumi", "cioccolato"];

export default function ReversePairing() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [catalog, setCatalog] = useState<Wine[]>([]);
  const [wineId, setWineId] = useState("");
  const [question, setQuestion] = useState("");
  const [selected, setSelected] = useState("carne rossa");

  useEffect(() => { loadWineCatalog().then((items) => { setCatalog(items); setWineId(items[0]?.id || ""); }); }, []);
  const wine = catalog.find((item) => item.id === wineId);
  const suggestions = useMemo(() => wine ? [...new Set([...wine.abbina_bene_con, ...INGREDIENTS.filter((item) => !wine.non_abbina_con.includes(item))])].slice(0, 8) : [], [wine]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> {t("nav.home")}
      </button>
      <div className="max-w-3xl mb-9">
        <div className="flex items-center gap-3 mb-3">
          <ChefHat className="w-7 h-7 text-gold-600" />
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600">{t("reverse.badge")}</p>
        </div>
        <h1 className="font-serif text-4xl text-bordeaux-950">{t("reverse.heading")}</h1>
        <p className="text-bordeaux-600 mt-3 leading-relaxed">{t("reverse.desc")}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="p-6 rounded-2xl bg-cream-100 border border-cream-200">
          <label className="text-xs text-bordeaux-600 block mb-1">{t("reverse.select")}</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bordeaux-400" />
            <select value={wineId} onChange={(e) => setWineId(e.target.value)} className="w-full pl-9 pr-3 py-3 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              {catalog.map((item) => <option key={item.id} value={item.id}>{item.nome} · {item.regione}</option>)}
            </select>
          </div>
          <label className="text-xs text-bordeaux-600 block mt-5 mb-2">{t("reverse.ask")}</label>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t("reverse.placeholder")} rows={3} className="w-full px-3 py-3 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
          <p className="text-xs text-bordeaux-500 mt-4">{t("reverse.ingredients")}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {INGREDIENTS.map((item) => (
              <button key={item} onClick={() => setSelected(item)} className={`text-xs px-3 py-1.5 rounded-full transition-colors ${selected === item ? "bg-bordeaux-800 text-cream-50" : "bg-cream-50 text-bordeaux-700 border border-cream-300"}`}>{item}</button>
            ))}
          </div>
        </section>
        <section className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100">
          {wine ? (
            <>
              <p className="text-xs uppercase tracking-wider text-gold-400">{t("reverse.analysis")} {wine.nome}</p>
              <h2 className="font-serif text-2xl text-cream-50 mt-2">{t("reverse.cook")} {selected}</h2>
              <p className="text-sm text-cream-200 mt-4 leading-relaxed">
                {question || t("results.reason")}
              </p>
              <div className="mt-6">
                <h3 className="font-serif text-lg text-cream-50 mb-3">{t("reverse.try")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((item) => (
                    <div key={item} className="p-3 rounded-lg bg-bordeaux-800/60 text-sm text-cream-200 flex items-center gap-2">
                      <Utensils className="w-3.5 h-3.5 text-gold-400" />{item}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => navigate(`/wine/${wine.id}`)} className="mt-7 text-sm text-gold-400 hover:text-gold-300">{t("reverse.fullcard")} →</button>
            </>
          ) : (
            <p className="text-cream-300">{t("reverse.loading")}</p>
          )}
        </section>
      </div>
    </div>
  );
}
