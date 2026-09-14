import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Wine as WineIcon, Utensils, ArrowLeft, Star } from "lucide-react";
import { useApp } from "../context/AppContext";

interface MenuItem {
  id: string;
  nome: string;
  descrizione: string;
  prezzo: string;
  categoria: string;
}

interface PairingInfo {
  id: string;
  score: number;
  nome: string;
  tipo: string;
  prezzo: number;
  regione: string;
}

export default function CustomerMenu() {
  const { t } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pairings, setPairings] = useState<Record<string, PairingInfo[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = searchParams.get("r") || "";
    const itemsParam = searchParams.get("items");
    const pairingsParam = searchParams.get("pairings");
    setRestaurantName(r);
    try {
      if (itemsParam) setMenuItems(JSON.parse(itemsParam));
      if (pairingsParam) setPairings(JSON.parse(pairingsParam));
    } catch { /* ignore */ }
    setLoading(false);
  }, [searchParams]);

  const groupedItems = useMemo(() => {
    const cats = ["Antipasto", "Primo", "Secondo", "Contorno", "Dolce"];
    const groups: Record<string, MenuItem[]> = {};
    for (const cat of cats) {
      const items = menuItems.filter((i) => i.categoria === cat);
      if (items.length > 0) groups[cat] = items;
    }
    return groups;
  }, [menuItems]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-bordeaux-500">{t("qrmenu.loading")}</div>;
  }

  if (menuItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Utensils className="w-12 h-12 mx-auto mb-4 text-bordeaux-400" />
        <p className="text-bordeaux-600">{t("qrmenu.noMenu")}</p>
        <button onClick={() => navigate("/")} className="mt-4 text-sm text-bordeaux-700 hover:text-gold-600">{t("nav.home")}</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> {t("nav.home")}
      </button>

      {/* Restaurant header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-bordeaux-800 flex items-center justify-center">
          <Utensils className="w-8 h-8 text-gold-400" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950">{restaurantName}</h1>
        <p className="text-sm text-bordeaux-600 mt-1">{t("qrmenu.customerSubtitle")}</p>
      </div>

      {/* Menu */}
      <div className="space-y-8">
        {Object.entries(groupedItems).map(([cat, items]) => (
          <div key={cat}>
            <h2 className="font-serif text-xl text-bordeaux-800 mb-4 pb-1 border-b border-cream-200">{t(`qrmenu.cat.${cat.toLowerCase()}`)}</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-cream-50 border border-cream-200">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-base font-semibold text-bordeaux-950">{item.nome}</h3>
                    <span className="text-sm font-semibold text-gold-700 shrink-0">{item.prezzo}</span>
                  </div>
                  {item.descrizione && <p className="text-xs text-bordeaux-600 mt-1">{item.descrizione}</p>}

                  {/* Wine pairings */}
                  {pairings[item.id] && pairings[item.id].length > 0 && (
                    <div className="mt-3 pt-3 border-t border-cream-200">
                      <p className="text-xs font-semibold text-gold-700 mb-2 flex items-center gap-1">
                        <WineIcon className="w-3.5 h-3.5" /> {t("qrmenu.suggestedWines")}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {pairings[item.id].map((w, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gold-600">#{i + 1}</span>
                              <span className="text-xs font-medium text-bordeaux-950 line-clamp-1">{w.nome}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-bordeaux-600">{w.tipo}</span>
                              <span className="text-xs text-bordeaux-500">€{w.prezzo.toFixed(0)}</span>
                              <span className="text-xs text-bordeaux-400 ml-auto">{w.regione}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
                              <span className="text-xs font-semibold text-bordeaux-800">IRC {w.score}/100</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-bordeaux-400">{t("qrmenu.poweredBy")}</p>
      </div>
    </div>
  );
}
