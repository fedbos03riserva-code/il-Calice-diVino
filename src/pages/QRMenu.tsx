import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Plus, Trash2, Store, Sparkles, Wine as WineIcon, Utensils, QrCode, MapPin, Globe, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import { pairDishWithCatalog } from "../lib/pairingEngine";
import type { Wine, PairingResult } from "../types/wine";

type TerritoryFilter = "oltrepo" | "italia" | "estero" | "tutti";

interface MenuItem {
  id: string;
  nome: string;
  descrizione: string;
  prezzo: string;
  categoria: "Antipasto" | "Primo" | "Secondo" | "Dolce" | "Contorno";
}

export default function QRMenu() {
  const { t, user, restaurantWines } = useApp();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<Wine[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [territory, setTerritory] = useState<TerritoryFilter>("oltrepo");
  const [pairings, setPairings] = useState<Record<string, PairingResult[]>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [restaurantName, setRestaurantName] = useState(user?.nome || "Il mio locale");
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    loadWineCatalog().then(setCatalog);
  }, []);

  const filteredCatalog = useMemo(() => {
    if (territory === "oltrepo") return catalog.filter((w) => w.regione === "Oltrepò Pavese");
    if (territory === "italia") return catalog.filter((w) => w.continente === "Italia");
    if (territory === "estero") return catalog.filter((w) => w.continente !== "Italia");
    return catalog;
  }, [catalog, territory]);

  const [formData, setFormData] = useState<MenuItem>({
    id: "", nome: "", descrizione: "", prezzo: "", categoria: "Primo",
  });

  const categories: MenuItem["categoria"][] = ["Antipasto", "Primo", "Secondo", "Contorno", "Dolce"];

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: MenuItem = { ...formData, id: crypto.randomUUID() };
    setMenuItems((prev) => [...prev, item]);
    setFormData({ id: "", nome: "", descrizione: "", prezzo: "", categoria: "Primo" });
    setShowForm(false);
    setQrGenerated(false);
  };

  const removeItem = (id: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
    setPairings((prev) => { const c = { ...prev }; delete c[id]; return c; });
    setQrGenerated(false);
  };

  const analyzeMenu = async () => {
    if (menuItems.length === 0) return;
    setAnalyzing(true);
    setPairings({});
    const winesToUse = [...filteredCatalog];
    for (const item of menuItems) {
      const dishText = `${item.nome} ${item.descrizione}`.trim();
      const results = pairDishWithCatalog(winesToUse, dishText, {}).slice(0, 3);
      setPairings((prev) => ({ ...prev, [item.id]: results }));
    }
    setTimeout(() => setAnalyzing(false), 600);
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    for (const cat of categories) {
      const items = menuItems.filter((i) => i.categoria === cat);
      if (items.length > 0) groups[cat] = items;
    }
    return groups;
  }, [menuItems]);

  const menuUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    params.set("r", restaurantName);
    params.set("items", JSON.stringify(menuItems));
    params.set("pairings", JSON.stringify(
      Object.fromEntries(
        Object.entries(pairings).map(([k, v]) => [
          k,
          v.map((r) => ({ id: r.wine.id, score: r.score.totale, nome: r.wine.nome, tipo: r.wine.tipo, prezzo: r.wine.prezzo, regione: r.wine.regione })),
        ])
      )
    ));
    return `${window.location.origin}/menu?${params.toString()}`;
  }, [restaurantName, menuItems, pairings]);

  const territoryOptions: { value: TerritoryFilter; label: string; icon: typeof MapPin }[] = [
    { value: "oltrepo", label: t("qrmenu.territory.oltrepo"), icon: MapPin },
    { value: "italia", label: t("qrmenu.territory.italia"), icon: Globe },
    { value: "estero", label: t("qrmenu.territory.estero"), icon: Globe },
    { value: "tutti", label: t("qrmenu.territory.tutti"), icon: WineIcon },
  ];

  if (!user || user.role !== "ristoratore") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Store className="w-12 h-12 mx-auto mb-4 text-bordeaux-400" />
        <p className="text-bordeaux-600">{t("qrmenu.loginRequired")}</p>
        <button onClick={() => navigate("/account")} className="mt-4 px-5 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors text-sm">
          {t("account.login")}
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400";
  const labelClass = "text-xs text-bordeaux-600 block mb-1";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-bordeaux-800 flex items-center justify-center">
          <QrCode className="w-6 h-6 text-gold-400" />
        </div>
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-bordeaux-950">{t("qrmenu.title")}</h1>
          <p className="text-sm text-bordeaux-600">{t("qrmenu.subtitle")}</p>
        </div>
      </div>

      {/* Restaurant name */}
      <div className="mb-6">
        <label className={labelClass}>{t("qrmenu.restaurantName")}</label>
        <input type="text" value={restaurantName} onChange={(e) => { setRestaurantName(e.target.value); setQrGenerated(false); }} className={inputClass + " max-w-md"} />
      </div>

      {/* Territory filter */}
      <div className="mb-6">
        <label className={labelClass}>{t("qrmenu.territory.label")}</label>
        <div className="flex flex-wrap gap-2">
          {territoryOptions.map((opt) => (
            <button key={opt.value} onClick={() => { setTerritory(opt.value); setQrGenerated(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${territory === opt.value ? "bg-bordeaux-800 text-cream-50" : "bg-cream-100 text-bordeaux-700 border border-cream-300 hover:border-gold-300"}`}>
              <opt.icon className="w-4 h-4" />
              {opt.label}
              {territory === opt.value && <span className="text-xs text-gold-400">({filteredCatalog.length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-bordeaux-950">{t("qrmenu.menuItems")} ({menuItems.length})</h2>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-gold-400 text-bordeaux-950 hover:bg-gold-300 transition-colors font-medium">
            <Plus className="w-4 h-4" /> {t("qrmenu.addDish")}
          </button>
        </div>

        {showForm && (
          <form onSubmit={addItem} className="mb-6 p-5 rounded-xl bg-cream-100 border border-cream-200 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t("qrmenu.dishName")}</label>
                <input type="text" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className={inputClass} placeholder={t("qrmenu.dishName.ph")} />
              </div>
              <div>
                <label className={labelClass}>{t("qrmenu.dishCategory")}</label>
                <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value as MenuItem["categoria"] })} className={inputClass}>
                  {categories.map((c) => <option key={c} value={c}>{t(`qrmenu.cat.${c.toLowerCase()}`)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("qrmenu.dishPrice")}</label>
                <input type="text" required value={formData.prezzo} onChange={(e) => setFormData({ ...formData, prezzo: e.target.value })} className={inputClass} placeholder="€ 18" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("qrmenu.dishDesc")}</label>
                <input type="text" value={formData.descrizione} onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })} className={inputClass} placeholder={t("qrmenu.dishDesc.ph")} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-lg bg-cream-200 text-bordeaux-700 hover:bg-cream-300 transition-colors text-sm">{t("restaurant.cancel")}</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors text-sm">{t("qrmenu.addDish")}</button>
            </div>
          </form>
        )}

        {menuItems.length === 0 ? (
          <div className="p-8 rounded-xl bg-cream-50 border border-cream-200 text-center">
            <Utensils className="w-10 h-10 mx-auto mb-3 text-bordeaux-300" />
            <p className="text-sm text-bordeaux-500">{t("qrmenu.noDishes")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([cat, items]) => (
              <div key={cat}>
                <h3 className="font-serif text-lg text-bordeaux-800 mb-3 border-b border-cream-200 pb-1">{t(`qrmenu.cat.${cat.toLowerCase()}`)}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-cream-50 border border-cream-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <h4 className="font-serif text-sm font-semibold text-bordeaux-950">{item.nome}</h4>
                            <span className="text-sm font-semibold text-gold-700">{item.prezzo}</span>
                          </div>
                          {item.descrizione && <p className="text-xs text-bordeaux-600 mt-0.5">{item.descrizione}</p>}
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg bg-cream-200 hover:bg-red-100 transition-colors shrink-0">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {/* Pairing results */}
                      {pairings[item.id] && pairings[item.id].length > 0 && (
                        <div className="mt-3 pt-3 border-t border-cream-200">
                          <p className="text-xs font-semibold text-gold-700 mb-2 flex items-center gap-1">
                            <WineIcon className="w-3.5 h-3.5" /> {t("qrmenu.suggestedWines")}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {pairings[item.id].map((r, i) => (
                              <div key={i} className="p-2.5 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-gold-600">#{i + 1}</span>
                                  <span className="text-xs font-medium text-bordeaux-950 line-clamp-1">{r.wine.nome}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-bordeaux-600">{r.wine.tipo}</span>
                                  <span className="text-xs text-bordeaux-500">€{r.wine.prezzo.toFixed(0)}</span>
                                  <span className="text-xs font-semibold text-bordeaux-800 ml-auto">IRC {r.score.totale}</span>
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
        )}
      </div>

      {/* Analyze button */}
      {menuItems.length > 0 && (
        <div className="mb-6">
          <button onClick={analyzeMenu} disabled={analyzing}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Sparkles className="w-5 h-5" /> {analyzing ? t("qrmenu.analyzing") : t("qrmenu.analyze")}
          </button>
          {analyzing && (
            <div className="mt-3 flex items-center gap-2 text-sm text-bordeaux-500">
              <div className="w-4 h-4 border-2 border-bordeaux-300 border-t-bordeaux-700 rounded-full animate-spin" />
              {t("qrmenu.analyzingDesc")}
            </div>
          )}
        </div>
      )}

      {/* QR Code section */}
      {menuItems.length > 0 && (
        <div className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-xl text-cream-50">{t("qrmenu.qrTitle")}</h2>
              </div>
              <p className="text-sm text-cream-300 leading-relaxed max-w-md">{t("qrmenu.qrDesc")}</p>
              <button onClick={() => setQrGenerated(true)}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm">
                <QrCode className="w-4 h-4" /> {t("qrmenu.generateQr")}
              </button>
            </div>
            {qrGenerated && (
              <div className="bg-cream-50 p-4 rounded-xl shrink-0">
                <QRCodeCanvas value={menuUrl} size={200} level="M" includeMargin={true} />
                <p className="text-xs text-bordeaux-600 text-center mt-2 font-medium">{restaurantName}</p>
                <a href={menuUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-1 text-xs text-bordeaux-700 hover:text-gold-600">
                  {t("qrmenu.previewMenu")} <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My wines note */}
      {restaurantWines.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-cream-100 border border-cream-200">
          <p className="text-sm text-bordeaux-700">
            <strong>{t("qrmenu.yourWinesNote")}</strong> {t("qrmenu.yourWinesNoteDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
