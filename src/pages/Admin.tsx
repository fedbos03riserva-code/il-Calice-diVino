import { useState, useEffect } from "react";
import { Shield, Package, Star, Users, Search, TrendingUp, Briefcase, Wine, Globe, DollarSign, ShoppingCart, CheckCircle2, Clock, FileText, Download, Mail, Phone, MapPin, Link2, Brain, QrCode, Loader2, Check, Building2, Calendar, Award, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";
import { loadWineCatalog } from "../data/wineCatalog";
import { wineries } from "../data/wineryDirectory";
import AIEngineDocs from "./AIEngineDocs";
import AIOverview from "./AIOverview";
import Documenti from "./Documenti";

type Tab = "panoramica" | "ordini" | "candidature" | "recensioni" | "ricerche" | "catalogo" | "qr-cantina" | "investitori" | "ai-engine" | "ai-overview" | "documenti";

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
  const [qrRows, setQrRows] = useState<QRRow[]>([]);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrSaving, setQrSaving] = useState<string | null>(null);
  const [qrSaved, setQrSaved] = useState<string | null>(null);

  interface QRRow {
    winery_id: string;
    annata: string;
    stock: string;
    prezzo_aggiornato: string;
    premi: string;
    eventi: string;
    descrizione: string;
    email_contatto: string;
    telefono_contatto: string;
    sito_web: string;
    instagram: string;
    note_deglustazione: string;
  }

  useEffect(() => {
    if (unlocked) {
      supabase.from("work_with_us").select("*").order("created_at", { ascending: false }).then(({ data }) => {
        if (data) setApplications(data as Application[]);
      });
      loadWineCatalog().then((cat) => {
        setWineCount(cat.length);
        setOltrepoCount(cat.filter((w) => w.regione === "Oltrepò Pavese").length);
      });
      loadQRData();
    }
  }, [unlocked]);

  const loadQRData = () => {
    setQrLoading(true);
    supabase.from("winery_qr_data").select("*").order("winery_id").then(({ data }) => {
      if (data) setQrRows(data as QRRow[]);
      setQrLoading(false);
    });
  };

  const saveQRRow = async (wineryId: string, field: string, value: string) => {
    setQrSaving(wineryId);
    const existing = qrRows.find((r) => r.winery_id === wineryId);
    const payload: Record<string, string> = existing ? { ...existing, [field]: value, updated_at: new Date().toISOString() } : { winery_id: wineryId, annata: "2023", [field]: value, updated_at: new Date().toISOString() };
    await supabase.from("winery_qr_data").upsert(payload);
    setQrRows((prev) => {
      const idx = prev.findIndex((r) => r.winery_id === wineryId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], [field]: value };
        return copy;
      }
      return [...prev, { winery_id: wineryId, annata: "2023", stock: "", prezzo_aggiornato: "", premi: "", eventi: "", descrizione: "", email_contatto: "", telefono_contatto: "", sito_web: "", instagram: "", note_deglustazione: "", [field]: value } as QRRow];
    });
    setQrSaving(null);
    setQrSaved(wineryId);
    setTimeout(() => setQrSaved(null), 2000);
  };

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
    { id: "qr-cantina", label: "QR Cantina", icon: QrCode },
    { id: "investitori", label: t("admin.investorRelations"), icon: Briefcase },
    { id: "ai-engine", label: "AI Engine", icon: Brain },
    { id: "ai-overview", label: "AI", icon: Sparkles },
    { id: "documenti", label: "Documenti PDF", icon: FileText },
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

      {/* QR Cantina management */}
      {tab === "qr-cantina" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200 mb-4">
            <p className="text-sm text-bordeaux-700">
              Gestisci i dati QR dinamici di ogni cantina. I campi modificati qui vengono aggiornati in tempo reale sulle schede tecniche pubbliche.
            </p>
          </div>
          {qrLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-bordeaux-400" />
            </div>
          ) : (
            <div className="space-y-3">
              {wineries.map((w) => {
                const row = qrRows.find((r) => r.winery_id === w.id);
                return (
                  <div key={w.id} className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-bordeaux-800 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-gold-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base text-bordeaux-950 truncate">{w.nome}</h3>
                        <p className="text-xs text-bordeaux-500">{w.comune} (PV) · {w.id}</p>
                      </div>
                      <Link to={`/wine-sheet/${w.id}`} target="_blank" className="text-xs text-bordeaux-600 hover:text-gold-600 transition-colors flex items-center gap-1 shrink-0">
                        <FileText className="w-3.5 h-3.5" /> Scheda
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <QRField label="Annata" icon={Calendar} value={row?.annata || ""} onSave={(v) => saveQRRow(w.id, "annata", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                      <QRField label="Stock" icon={Package} value={row?.stock || ""} onSave={(v) => saveQRRow(w.id, "stock", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                      <QRField label="Prezzo FOB" icon={DollarSign} value={row?.prezzo_aggiornato || ""} onSave={(v) => saveQRRow(w.id, "prezzo_aggiornato", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                      <QRField label="Premi" icon={Award} value={row?.premi || ""} onSave={(v) => saveQRRow(w.id, "premi", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                      <QRField label="Eventi" icon={Calendar} value={row?.eventi || ""} onSave={(v) => saveQRRow(w.id, "eventi", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                      <QRField label="Email" icon={Mail} value={row?.email_contatto || ""} onSave={(v) => saveQRRow(w.id, "email_contatto", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                      <QRField label="Telefono" icon={Phone} value={row?.telefono_contatto || ""} onSave={(v) => saveQRRow(w.id, "telefono_contatto", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                      <QRField label="Sito web" icon={Globe} value={row?.sito_web || ""} onSave={(v) => saveQRRow(w.id, "sito_web", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                      <QRField label="Instagram" icon={Globe} value={row?.instagram || ""} onSave={(v) => saveQRRow(w.id, "instagram", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} />
                    </div>
                    <div className="mt-3">
                      <QRField label="Descrizione" icon={FileText} value={row?.descrizione || ""} onSave={(v) => saveQRRow(w.id, "descrizione", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} textarea />
                      <div className="mt-3">
                        <QRField label="Note degustazione" icon={Wine} value={row?.note_deglustazione || ""} onSave={(v) => saveQRRow(w.id, "note_deglustazione", v)} saving={qrSaving === w.id} saved={qrSaved === w.id} textarea />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Relazioni Investitori */}
      {tab === "investitori" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-bordeaux-950 text-cream-100">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-gold-400" />
              <div>
                <h2 className="font-serif text-xl text-cream-50">{t("admin.investorRelations")}</h2>
                <p className="text-xs text-cream-300">B&F 45 -- Intelligent Wine Pairing & Export Hub · Oltrep&ograve; Pavese</p>
              </div>
            </div>
            <p className="text-sm text-cream-200 leading-relaxed mb-4">{t("admin.investorIntro")}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/business-plan" className="px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm text-center flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> {t("admin.openBusinessPlan")}
              </a>
              <a href="/business-plan" onClick={(e) => { e.preventDefault(); window.open("/business-plan", "_blank"); }} className="px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm text-center border border-gold-700/30 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> {t("admin.downloadPdf")}
              </a>
            </div>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Wine} label={t("admin.stat.wines")} value={String(wineCount)} color="bg-cream-50 border-cream-200" />
            <StatCard icon={Globe} label={t("admin.stat.oltrepo")} value={String(oltrepoCount)} color="bg-bordeaux-50 border-bordeaux-200" />
            <StatCard icon={Users} label={t("admin.investor.users")} value="1.847" color="bg-cream-50 border-cream-200" />
            <StatCard icon={Briefcase} label={t("admin.investor.wineries")} value="12" color="bg-gold-50 border-gold-200" />
            <StatCard icon={Wine} label="Vini catalogati" value="225" color="bg-cream-50 border-cream-200" />
            <StatCard icon={Globe} label="Paesi export" value="15+" color="bg-bordeaux-50 border-bordeaux-200" />
          </div>

          {/* Territory export metrics */}
          <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-600" /> Metriche Export Territorio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <span className="text-sm text-bordeaux-600">Cantine Export Ready</span>
                  <span className="text-sm font-semibold text-green-700">10 / 12 (83%)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <span className="text-sm text-bordeaux-600">Ettari totali</span>
                  <span className="text-sm font-semibold text-bordeaux-950">1.835 ha</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <span className="text-sm text-bordeaux-600">Capacita produttiva</span>
                  <span className="text-sm font-semibold text-bordeaux-950">32.000 hl/anno</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-bordeaux-600">Paesi serviti</span>
                  <span className="text-sm font-semibold text-bordeaux-950">15+ paesi</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <span className="text-sm text-bordeaux-600">Prezzo FOB medio</span>
                  <span className="text-sm font-semibold text-bordeaux-950">&euro;7.36/bt</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <span className="text-sm text-bordeaux-600">MOQ medio</span>
                  <span className="text-sm font-semibold text-bordeaux-950">1.100 bt</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                  <span className="text-sm text-bordeaux-600">Certificazioni medie/cantina</span>
                  <span className="text-sm font-semibold text-bordeaux-950">2.8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-bordeaux-600">Lingue team medie</span>
                  <span className="text-sm font-semibold text-bordeaux-950">3.2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Funding round */}
          <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-4">{t("admin.investor.metrics")}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                <span className="text-sm text-bordeaux-600">{t("admin.investor.round")}</span>
                <span className="text-sm font-semibold text-bordeaux-950">Pre-seed / Seed -- &euro;500K</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                <span className="text-sm text-bordeaux-600">{t("admin.investor.valuation")}</span>
                <span className="text-sm font-semibold text-bordeaux-950">&euro;3M pre-money</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                <span className="text-sm text-bordeaux-600">{t("admin.investor.runway")}</span>
                <span className="text-sm font-semibold text-bordeaux-950">18 mesi (fino a Q1 2027)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                <span className="text-sm text-bordeaux-600">Burn rate mensile</span>
                <span className="text-sm font-semibold text-bordeaux-950">&euro;27K/mese</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                <span className="text-sm text-bordeaux-600">MRR attuale</span>
                <span className="text-sm font-semibold text-bordeaux-950">&euro;8.2K (target Q4: &euro;15K)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-bordeaux-600">{t("admin.investor.target")}</span>
                <span className="text-sm font-semibold text-bordeaux-950">&euro;150K MRR (Q4 2026)</span>
              </div>
            </div>
          </div>

          {/* Product features */}
          <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Funzionalita Attive (Q3 2026)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Sommelier AI in Wine Detail, Wine Lab, Abbinamenti, Reverse Pairing, Winery Match</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <strong>Modalita PRO</strong> con Claude Sonnet 4: analisi molecolare avanzata, discorsi narrativi 4-5 righe, temperatura servizio, decantazione</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <strong>15 principi chimico-enologici</strong> nel system prompt (tannini-proteine, acidita-grassi, Maillard, umami, capsaicina-TRPV1)</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Mappa satellitare interattiva (Esri World Imagery + OSM via Leaflet)</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Storia del Territorio — pagina territorio sotto Cantina</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Demo Fiere PDF precompilato per esportatori</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Guida Vitigni (13 vitigni, terroir, denominazioni)</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> QR dinamici cantine con dati in tempo reale</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> 7 lingue (IT, EN, FR, ES, DE, JP, NL)</div>
              <div className="flex items-start gap-2 text-sm text-bordeaux-700"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Codici AI (BF45PROVA, BF45PRO, BF45TRIAL) con validazione database e rate limiting</div>
            </div>
          </div>

          {/* Technology competitive advantages */}
          <div className="p-6 rounded-xl bg-bordeaux-950 text-cream-100">
            <h3 className="font-serif text-lg text-gold-400 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" /> Punti di forza tecnologici
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
                <p className="text-xs font-semibold text-gold-400 mb-2">Motore IRC a 15 principi chimici</p>
                <p className="text-xs text-cream-200">Unico al mondo a ragionare a livello molecolare con composti per nome esatto (procianidine B1-B4, acido tartarico 4-7 g/L, recettori TRPV1, T1R2/T1R3). Non usa regole empiriche.</p>
              </div>
              <div className="p-4 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
                <p className="text-xs font-semibold text-gold-400 mb-2">Discorso narrativo "Perche del vino"</p>
                <p className="text-xs text-cream-200">Ogni abbinamento genera un discorso di 4-5 righe che spiega chimica, pulizia, abbinamenti aromatici, struttura e cosa accade in bocca. Come un maestro sommelier con dottorato in chimica.</p>
              </div>
              <div className="p-4 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
                <p className="text-xs font-semibold text-gold-400 mb-2">Analisi digestiva</p>
                <p className="text-xs text-cream-200">Considera l'impatto digestivo: acidita e secrezione gastrica, tannini e digestione proteica, CO2 e sazieta, etanolo e assorbimento vitaminico, zuccheri e disarmonia digestiva.</p>
              </div>
              <div className="p-4 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
                <p className="text-xs font-semibold text-gold-400 mb-2">GeoMapping satellitare</p>
                <p className="text-xs text-cream-200">Mappa interattiva con Esri World Imagery + OSM via Leaflet, coordinate GPS reali per ogni cantina, GeoJSON per le 4 zone DOC dell'Oltrepo Pavese.</p>
              </div>
              <div className="p-4 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
                <p className="text-xs font-semibold text-gold-400 mb-2">Due modelli AI scalabili</p>
                <p className="text-xs text-cream-200">Base (Claude 3.5 Haiku, 4k token) per velocita ed economia. PRO (Claude Sonnet 4, 6k token) per analisi molecolare avanzata. Switching runtime senza downtime.</p>
              </div>
              <div className="p-4 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
                <p className="text-xs font-semibold text-gold-400 mb-2">Sicurezza enterprise</p>
                <p className="text-xs text-cream-200">Rate limiting 10 req/min per IP, codici monouso con scadenza, sanitizzazione input, RLS su tutte le tabelle, CORS headers, limite body 200 KB. Edge Functions Deno isolati.</p>
              </div>
            </div>
          </div>

          {/* Revenue breakdown */}
          <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Breakdown Ricavi per Stream</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-bordeaux-600">Abbonamenti B2B (ristoratori)</span>
                  <span className="text-sm font-semibold text-bordeaux-950">45%</span>
                </div>
                <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                  <div className="h-2 rounded-full bg-bordeaux-700" style={{ width: "45%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-bordeaux-600">Cantina Pro (abbonamenti cantine)</span>
                  <span className="text-sm font-semibold text-bordeaux-950">25%</span>
                </div>
                <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                  <div className="h-2 rounded-full bg-gold-500" style={{ width: "25%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-bordeaux-600">Export matching & RFQ</span>
                  <span className="text-sm font-semibold text-bordeaux-950">20%</span>
                </div>
                <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                  <div className="h-2 rounded-full bg-green-600" style={{ width: "20%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-bordeaux-600">Consulenza privata & token AI</span>
                  <span className="text-sm font-semibold text-bordeaux-950">10%</span>
                </div>
                <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                  <div className="h-2 rounded-full bg-bordeaux-400" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* KPIs trimestrali */}
          <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-4">KPI Trimestrali (Q3 2026)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-cream-100">
                <p className="font-serif text-2xl text-bordeaux-950">2.380</p>
                <p className="text-xs text-bordeaux-500">Abbinamenti AI / mese</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-cream-100">
                <p className="font-serif text-2xl text-bordeaux-950">52</p>
                <p className="text-xs text-bordeaux-500">RFQ inviate</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-cream-100">
                <p className="font-serif text-2xl text-bordeaux-950">284</p>
                <p className="text-xs text-bordeaux-500">Codici AI attivati</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-cream-100">
                <p className="font-serif text-2xl text-bordeaux-950">6.8k</p>
                <p className="text-xs text-bordeaux-500">Visite schede cantine</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gold-50 border border-gold-200">
                <p className="font-serif text-2xl text-bordeaux-950">15</p>
                <p className="text-xs text-bordeaux-500">Principi chimico-enologici</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gold-50 border border-gold-200">
                <p className="font-serif text-2xl text-bordeaux-950">2</p>
                <p className="text-xs text-bordeaux-500">Modelli AI (Haiku + Sonnet)</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gold-50 border border-gold-200">
                <p className="font-serif text-2xl text-bordeaux-950">7</p>
                <p className="text-xs text-bordeaux-500">Lingue supportate</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gold-50 border border-gold-200">
                <p className="font-serif text-2xl text-bordeaux-950">12</p>
                <p className="text-xs text-bordeaux-500">Cantine mappate GPS</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-4">{t("admin.investor.contacts")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bordeaux-100 flex items-center justify-center"><Mail className="w-5 h-5 text-bordeaux-700" /></div>
                <div><p className="text-xs text-bordeaux-500">Email</p><p className="text-sm font-semibold text-bordeaux-950">invest@bf45wine.com</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bordeaux-100 flex items-center justify-center"><Phone className="w-5 h-5 text-bordeaux-700" /></div>
                <div><p className="text-xs text-bordeaux-500">Telefono</p><p className="text-sm font-semibold text-bordeaux-950">+39 0385 000 000</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bordeaux-100 flex items-center justify-center"><MapPin className="w-5 h-5 text-bordeaux-700" /></div>
                <div><p className="text-xs text-bordeaux-500">Sede</p><p className="text-sm font-semibold text-bordeaux-950">Pavia, Oltrep&ograve; Pavese, Italia</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bordeaux-100 flex items-center justify-center"><Link2 className="w-5 h-5 text-bordeaux-700" /></div>
                <div><p className="text-xs text-bordeaux-500">LinkedIn</p><p className="text-sm font-semibold text-bordeaux-950">linkedin.com/company/bf45wine</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Engine Docs */}
      {tab === "ai-engine" && <AIEngineDocs />}
      {tab === "ai-overview" && <AIOverview />}
      {tab === "documenti" && <Documenti />}
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

function QRField({ label, icon: Icon, value, onSave, saving, saved, textarea }: { label: string; icon: typeof Package; value: string; onSave: (v: string) => void; saving: boolean; saved: boolean; textarea?: boolean }) {
  const [val, setVal] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => { setVal(value); }, [value]);

  const handleSave = () => {
    onSave(val);
    setEditing(false);
  };

  return (
    <div>
      <label className="text-xs text-bordeaux-500 mb-1 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
        {saved && <Check className="w-3 h-3 text-green-600" />}
      </label>
      {textarea ? (
        <textarea
          value={val}
          onChange={(e) => { setVal(e.target.value); setEditing(true); }}
          onBlur={handleSave}
          rows={2}
          placeholder="—"
          className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-xs text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
        />
      ) : (
        <input
          type="text"
          value={val}
          onChange={(e) => { setVal(e.target.value); setEditing(true); }}
          onBlur={editing ? handleSave : undefined}
          placeholder="—"
          className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-xs text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
      )}
      {saving && <Loader2 className="w-3 h-3 animate-spin text-bordeaux-400 mt-1" />}
    </div>
  );
}
