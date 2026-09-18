import { useState, useEffect } from "react";
import { Shield, Package, Star, Users, Search, TrendingUp, Briefcase, Wine, Globe, DollarSign, ShoppingCart, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";
import { loadWineCatalog } from "../data/wineCatalog";

type Tab = "panoramica" | "ordini" | "candidature" | "recensioni" | "ricerche" | "catalogo";

interface Application {
  id: string;
  name: string;
  email: string;
  role: string;
  message: string;
  status: string;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  cantine: "Cantina / Produttore",
  ristoratore: "Ristoratore / Locale",
  export: "Export / Distributore",
  sviluppatore: "Sviluppatore",
  marketing: "Marketing",
  investitore: "Investitore / Partner",
  altro: "Altro",
};

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  new: { label: "Nuovo", icon: Clock, color: "text-gold-600 bg-gold-50 border-gold-200" },
  reviewed: { label: "Visto", icon: CheckCircle2, color: "text-blue-600 bg-blue-50 border-blue-200" },
  contacted: { label: "Contattato", icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200" },
};

export default function Admin() {
  const { orders, reviews, searchHistory, restaurantWines, savedWines, cart, t } = useApp();
  const [tab, setTab] = useState<Tab>("panoramica");
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [wineCount, setWineCount] = useState(0);
  const [oltrepoCount, setOltrepoCount] = useState(0);

  useEffect(() => {
    if (unlocked) {
      supabase.from("work_with_us").select("*").order("created_at", { ascending: false }).then(({ data }) => {
        if (data) setApplications(data as Application[]);
      });
      loadWineCatalog().then((cat) => {
        setWineCount(cat.length);
        setOltrepoCount(cat.filter((w) => w.regione === "Oltrepò Pavese").length);
      });
    }
  }, [unlocked]);

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from("work_with_us").update({ status }).eq("id", id);
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <Shield className="w-10 h-10 text-gold-400 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-cream-50 text-center">{t("admin.title")}</h1>
          <p className="text-sm text-cream-300 text-center mt-2">{t("admin.subtitle")}</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (password === "bf45-admin") { setUnlocked(true); setError(false); } else { setError(true); } }}
            className="mt-6"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("admin.password")}
              className="w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            {error && <p className="text-xs text-red-400 mt-2">{t("admin.wrong")}</p>}
            <button type="submit" className="w-full mt-3 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors">
              {t("admin.access")}
            </button>
          </form>
          <p className="text-xs text-cream-400 text-center mt-4">{t("admin.hint")} <span className="font-mono text-gold-400">bf45-admin</span></p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const newApps = applications.filter((a) => a.status === "new").length;

  const tabs: { id: Tab; label: string; icon: typeof Package; badge?: number }[] = [
    { id: "panoramica", label: t("admin.tab.panoramica"), icon: TrendingUp },
    { id: "ordini", label: t("admin.tab.ordini"), icon: Package, badge: orders.length },
    { id: "candidature", label: t("admin.tab.candidature"), icon: Briefcase, badge: newApps },
    { id: "recensioni", label: t("admin.tab.recensioni"), icon: Star, badge: reviews.length },
    { id: "ricerche", label: t("admin.tab.ricerche"), icon: Search, badge: searchHistory.length },
    { id: "catalogo", label: t("admin.tab.catalogo"), icon: Wine },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bordeaux-950 flex items-center justify-center">
            <Shield className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-600">{t("admin.badge")}</p>
            <h1 className="font-serif text-2xl text-bordeaux-950">{t("admin.heading")}</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-bordeaux-500">
          <span className="px-3 py-1.5 rounded-full bg-cream-100 border border-cream-200">{wineCount} {t("admin.stat.wines").toLowerCase()}</span>
          <span className="px-3 py-1.5 rounded-full bg-bordeaux-50 border border-bordeaux-200">{oltrepoCount} Oltrepò</span>
          <a href="/business-plan" className="px-3 py-1.5 rounded-full bg-gold-400 text-bordeaux-950 font-medium hover:bg-gold-300 transition-colors flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> {t("admin.investorRelations")}
          </a>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-cream-200 pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === item.id ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-600 hover:bg-cream-100"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === item.id ? "bg-gold-400 text-bordeaux-950" : "bg-bordeaux-100 text-bordeaux-700"}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Panoramica */}
      {tab === "panoramica" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={DollarSign} label={t("admin.stat.revenue")} value={`€${totalRevenue.toFixed(2)}`} color="bg-green-50 border-green-200" />
            <StatCard icon={Package} label={t("admin.stat.orders")} value={String(orders.length)} color="bg-cream-50 border-cream-200" />
            <StatCard icon={Star} label={t("admin.stat.rating")} value={avgRating} color="bg-gold-50 border-gold-200" />
            <StatCard icon={Briefcase} label={t("admin.stat.apps")} value={String(newApps)} color="bg-bordeaux-50 border-bordeaux-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Wine} label={t("admin.stat.wines")} value={String(wineCount)} color="bg-cream-50 border-cream-200" />
            <StatCard icon={Globe} label={t("admin.stat.oltrepo")} value={String(oltrepoCount)} color="bg-bordeaux-50 border-bordeaux-200" />
            <StatCard icon={Search} label={t("admin.stat.searches")} value={String(searchHistory.length)} color="bg-cream-50 border-cream-200" />
            <StatCard icon={ShoppingCart} label={t("admin.stat.cart")} value={String(cart.length)} color="bg-cream-50 border-cream-200" />
          </div>
        </div>
      )}

      {/* Ordini */}
      {tab === "ordini" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <EmptyState icon={Package} text={t("admin.empty.orders")} />
          ) : (
            orders.map((order) => (
              <div key={order.number} className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-bordeaux-500">{order.number}</span>
                      <span className="text-xs text-bordeaux-400">{new Date(order.date).toLocaleDateString("it-IT")}</span>
                    </div>
                    <h3 className="font-serif text-lg text-bordeaux-950 mt-1">{order.customerName}</h3>
                    <p className="text-sm text-bordeaux-600">{order.email}</p>
                    <p className="text-sm text-bordeaux-600 mt-1">{order.address}, {order.zip} {order.city}, {order.country}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-serif text-2xl text-bordeaux-950">€{order.total.toFixed(2)}</p>
                    <p className="text-xs text-bordeaux-500">Spedizione €{order.shipping.toFixed(2)} · IVA €{order.vat.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-cream-200 pt-3">
                  <p className="text-xs font-semibold text-bordeaux-700 mb-2">Articoli</p>
                  <ul className="space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i} className="text-sm text-bordeaux-600 flex justify-between">
                        <span>{item.wine.nome} x{item.quantity}</span>
                        <span>€{(item.wine.prezzo * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Candidature */}
      {tab === "candidature" && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <EmptyState icon={Briefcase} text={t("admin.empty.apps")} />
          ) : (
            applications.map((app) => {
              const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.new;
              return (
                <div key={app.id} className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif text-lg text-bordeaux-950">{app.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusCfg.color} flex items-center gap-1`}>
                          <statusCfg.icon className="w-3 h-3" /> {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-bordeaux-600">{app.email}</p>
                      <p className="text-xs text-bordeaux-500 mt-1">Profilo: {ROLE_LABELS[app.role] || app.role}</p>
                      <p className="text-sm text-bordeaux-700 mt-3 leading-relaxed bg-cream-100 p-3 rounded-lg">{app.message}</p>
                      <p className="text-xs text-bordeaux-400 mt-2">{new Date(app.created_at).toLocaleString("it-IT")}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => updateAppStatus(app.id, "reviewed")}
                        className="text-xs px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors">
                        {t("admin.markSeen")}
                      </button>
                      <button onClick={() => updateAppStatus(app.id, "contacted")}
                        className="text-xs px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors">
                        {t("admin.markContacted")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Recensioni */}
      {tab === "recensioni" && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <EmptyState icon={Star} text={t("admin.empty.reviews")} />
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl bg-cream-50 border border-cream-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-bordeaux-950">{review.userName}</p>
                    <p className="text-xs text-bordeaux-500">Vino: {review.wineId} · {new Date(review.timestamp).toLocaleDateString("it-IT")}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                    <span className="text-sm text-bordeaux-700">{review.rating}</span>
                    <span className="text-xs text-bordeaux-400 ml-2">({review.helpful} utili)</span>
                  </div>
                </div>
                <p className="text-sm text-bordeaux-600 mt-2">{review.text}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Ricerche */}
      {tab === "ricerche" && (
        <div className="space-y-3">
          {searchHistory.length === 0 ? (
            <EmptyState icon={Search} text={t("admin.empty.searches")} />
          ) : (
            searchHistory.map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-bordeaux-950 capitalize">{entry.piatto}</p>
                  <p className="text-xs text-bordeaux-500">{new Date(entry.timestamp).toLocaleString("it-IT")}</p>
                </div>
                <span className="text-xs text-bordeaux-600">{entry.resultsCount} risultati</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Catalogo */}
      {tab === "catalogo" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Wine} label={t("admin.stat.wines")} value={String(wineCount)} color="bg-cream-50 border-cream-200" />
          <StatCard icon={Globe} label={t("admin.stat.oltrepo")} value={String(oltrepoCount)} color="bg-bordeaux-50 border-bordeaux-200" />
          <StatCard icon={Users} label={t("admin.stat.restWines")} value={String(restaurantWines.length)} color="bg-cream-50 border-cream-200" />
          <StatCard icon={Star} label={t("admin.stat.saved")} value={String(savedWines.length)} color="bg-gold-50 border-gold-200" />
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Package; label: string; value: string; color: string }) {
  return (
    <div className={`p-5 rounded-xl border ${color}`}>
      <Icon className="w-5 h-5 text-bordeaux-600 mb-2" />
      <p className="text-xs text-bordeaux-500">{label}</p>
      <p className="font-serif text-2xl text-bordeaux-950 mt-1">{value}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof Package; text: string }) {
  return (
    <div className="text-center py-16">
      <Icon className="w-10 h-10 text-bordeaux-300 mx-auto mb-3" />
      <p className="text-bordeaux-500 text-sm">{text}</p>
    </div>
  );
}
