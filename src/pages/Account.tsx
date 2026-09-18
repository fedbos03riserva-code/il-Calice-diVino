import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, History, Heart, Store, LogOut, ArrowRight, Package, Sparkles, Globe2, BarChart3, FileText, Mail, Phone, Building2, Wine, ChefHat, Zap, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import WineCard from "../components/WineCard";
import { wineries } from "../data/wineryDirectory";
import type { UserRole } from "../types/wine";

const ROLE_CARDS: { role: UserRole; icon: typeof Wine; title: string; desc: string; color: string; iconBg: string; features: string[] }[] = [
  {
    role: "privato",
    icon: Sparkles,
    title: "Privato",
    desc: "Appassionato di vino che vuole scoprire e abbinare",
    color: "border-cream-200 bg-cream-50",
    iconBg: "bg-bordeaux-100 text-bordeaux-700",
    features: ["Abbinamenti AI", "Quiz del palato", "Wine Lab molecolare", "Catalogo completo"],
  },
  {
    role: "ristoratore",
    icon: ChefHat,
    title: "Ristoratore",
    desc: "Gestisci la carta vini del tuo locale",
    color: "border-gold-200 bg-gold-50",
    iconBg: "bg-gold-200 text-gold-800",
    features: ["Dashboard ristorante", "Carta vini digitale", "QR menu", "Consulenza AI menu"],
  },
  {
    role: "cantina",
    icon: Wine,
    title: "Cantina",
    desc: "Produttore che vuole crescere nell'export",
    color: "border-bordeaux-200 bg-bordeaux-50",
    iconBg: "bg-bordeaux-800 text-gold-400",
    features: ["Gestione vini", "QR dinamico", "Profilo export", "AI matching buyer"],
  },
  {
    role: "esportatore",
    icon: Globe2,
    title: "Esportatore",
    desc: "Distributore o buyer internazionale",
    color: "border-bordeaux-200 bg-bordeaux-50",
    iconBg: "bg-bordeaux-800 text-gold-400",
    features: ["AI matching cantine", "Richieste RFQ", "Mappa vini", "Materiali B2B"],
  },
];

export default function Account() {
  const { t, user, login, logout, savedWines, searchHistory, orders } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("privato");
  const [partitaIva, setPartitaIva] = useState("");
  const [ragioneSociale, setRagioneSociale] = useState("");
  const [paeseAttivita, setPaeseAttivita] = useState("");
  const [telefono, setTelefono] = useState("");
  const [wineryId, setWineryId] = useState("");
  const [tab, setTab] = useState<"orders" | "history" | "saved" | "dashboard" | "export" | "cantina">("orders");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nome) return;
    if (role === "esportatore") {
      login(email, nome, role, { partitaIva, ragioneSociale, paeseAttivita, telefono });
    } else if (role === "cantina") {
      login(email, nome, role, { partitaIva, ragioneSociale, telefono, wineryId });
    } else {
      login(email, nome, role);
    }
  };

  const loginDemo = (demoRole: UserRole) => {
    if (demoRole === "privato") login("demo@bf45.it", "Utente Demo", "privato");
    else if (demoRole === "ristoratore") login("ristoratore@bf45.it", "Ristoratore Demo", "ristoratore");
    else if (demoRole === "esportatore") login("export@bf45.it", "Esportatore Demo", "esportatore", { partitaIva: "IT01234567890", ragioneSociale: "Wine Export Demo Ltd", paeseAttivita: "Giappone", telefono: "+39 02 000 000" });
    else if (demoRole === "cantina") login("cantina@bf45.it", "Cantina Demo", "cantina", { partitaIva: "IT09876543210", ragioneSociale: wineries[0]?.nome || "Cantina Demo", telefono: "+39 0385 111 111", wineryId: wineries[0]?.id || "" });
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bordeaux-950 flex items-center justify-center">
            <Wine className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl text-bordeaux-950">{t("account.title")}</h1>
          <p className="text-sm text-bordeaux-500 mt-2">Scegli il tuo profilo e accedi al mondo BF45</p>
        </div>

        <div className="flex gap-2 mb-6 p-1 rounded-xl bg-cream-100 border border-cream-200">
          <button onClick={() => setMode("login")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${mode === "login" ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-600"}`}>
            {t("account.login")}
          </button>
          <button onClick={() => setMode("register")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${mode === "register" ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-600"}`}>
            {t("account.register")}
          </button>
        </div>

        {mode === "register" && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-bordeaux-700 uppercase tracking-wider mb-3">Seleziona il tuo profilo</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLE_CARDS.map((card) => (
                <button key={card.role} type="button" onClick={() => setRole(card.role)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${role === card.role ? "border-gold-400 bg-gold-50 shadow-md" : `${card.color} hover:border-gold-300`}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-bordeaux-950">{card.title}</h3>
                    </div>
                    {role === card.role && <Check className="w-4 h-4 text-gold-600 ml-auto" />}
                  </div>
                  <p className="text-xs text-bordeaux-500 mb-2">{card.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {card.features.map((f) => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream-100 text-bordeaux-600 border border-cream-200">{f}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-cream-50 rounded-2xl border border-cream-200 p-6">
          {mode === "register" && (
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("account.name")}</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          )}
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("account.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
          <div>
            <label className="text-xs text-bordeaux-600 block mb-1">{t("account.password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>

          {mode === "register" && role === "esportatore" && (
            <div className="space-y-3 p-4 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
              <p className="text-xs font-semibold text-bordeaux-800 uppercase tracking-wider">{t("account.export.legalTitle")}</p>
              <div>
                <label className="text-xs text-bordeaux-600 block mb-1">{t("account.export.company")}</label>
                <input type="text" value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value)} required placeholder="Es. Wine Export Ltd"
                  className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-bordeaux-600 block mb-1">{t("account.export.vat")}</label>
                  <input type="text" value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} required placeholder="IT01234567890"
                    className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="text-xs text-bordeaux-600 block mb-1">{t("account.export.country")}</label>
                  <input type="text" value={paeseAttivita} onChange={(e) => setPaeseAttivita(e.target.value)} required placeholder="Es. Giappone"
                    className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
              <div>
                <label className="text-xs text-bordeaux-600 block mb-1">{t("account.export.phone")}</label>
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+39 02 000 000"
                  className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <p className="text-xs text-bordeaux-400 italic">{t("account.export.legalNote")}</p>
            </div>
          )}
          {mode === "register" && role === "cantina" && (
            <div className="space-y-3 p-4 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
              <p className="text-xs font-semibold text-bordeaux-800 uppercase tracking-wider">{t("account.cantina.legalTitle")}</p>
              <div>
                <label className="text-xs text-bordeaux-600 block mb-1">{t("account.cantina.winery")}</label>
                <select value={wineryId} onChange={(e) => { setWineryId(e.target.value); const w = wineries.find(w => w.id === e.target.value); if (w) setRagioneSociale(w.nome); }} required
                  className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option value="">{t("account.cantina.winery.select")}</option>
                  {wineries.map(w => <option key={w.id} value={w.id}>{w.nome} — {w.comune}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-bordeaux-600 block mb-1">{t("account.cantina.company")}</label>
                <input type="text" value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value)} required placeholder="Es. Cantina Sociale di Canneto"
                  className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-bordeaux-600 block mb-1">{t("account.cantina.vat")}</label>
                  <input type="text" value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} required placeholder="IT01234567890"
                    className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="text-xs text-bordeaux-600 block mb-1">{t("account.cantina.phone")}</label>
                  <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+39 0385 000 000"
                    className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
              <p className="text-xs text-bordeaux-400 italic">{t("account.cantina.legalNote")}</p>
            </div>
          )}

          <button type="submit" className="w-full py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors">
            {mode === "login" ? t("account.login") : t("account.register")}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-bordeaux-400 text-center mb-3">Prova subito con un account demo:</p>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_CARDS.map((card) => (
              <button key={card.role} type="button" onClick={() => loginDemo(card.role)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-200 text-bordeaux-700 text-xs font-medium hover:border-gold-300 hover:bg-gold-50 transition-colors">
                <card.icon className="w-4 h-4 text-gold-600" />
                {card.title}
              </button>
            ))}
          </div>
          <p className="text-xs text-bordeaux-400 text-center mt-3">{t("account.demoNote")}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "orders" as const, label: "I miei ordini", icon: Package },
    { id: "history" as const, label: t("account.history"), icon: History },
    { id: "saved" as const, label: t("account.saved"), icon: Heart },
    ...(user.role === "ristoratore" ? [{ id: "dashboard" as const, label: t("account.dashboard"), icon: Store }] : []),
    ...(user.role === "esportatore" ? [{ id: "export" as const, label: t("account.export.dashboard"), icon: Globe2 }] : []),
    ...(user.role === "cantina" ? [{ id: "cantina" as const, label: t("account.cantina.dashboard"), icon: Wine }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-bordeaux-800 flex items-center justify-center">
            <UserIcon className="w-7 h-7 text-gold-400" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-bordeaux-950">{user.nome}</h1>
            <p className="text-sm text-bordeaux-600">{user.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 mt-1 inline-block">
              {t(`account.role.${user.role}`)}
            </span>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-1 text-sm text-bordeaux-600 hover:text-bordeaux-800 transition-colors">
          <LogOut className="w-4 h-4" />
          {t("account.logout")}
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-cream-200 overflow-x-auto">
        {tabs.map((tabItem) => (
          <button key={tabItem.id} onClick={() => setTab(tabItem.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === tabItem.id ? "border-bordeaux-800 text-bordeaux-950" : "border-transparent text-bordeaux-500 hover:text-bordeaux-700"
            }`}>
            <tabItem.icon className="w-4 h-4" />
            {tabItem.label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-bordeaux-300 mx-auto mb-3" />
              <p className="text-bordeaux-500">Nessun ordine effettuato. I tuoi ordini appariranno qui.</p>
              <button onClick={() => navigate("/catalog")} className="mt-4 text-sm text-bordeaux-700 hover:text-gold-600">Sfoglia il catalogo &rarr;</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.number} className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-bordeaux-500">{order.number}</span>
                        <span className="text-xs text-bordeaux-400">{new Date(order.date).toLocaleDateString("it-IT")}</span>
                      </div>
                      <p className="text-sm text-bordeaux-600 mt-1">Spedizione a: {order.address}, {order.zip} {order.city}, {order.country}</p>
                    </div>
                    <span className="font-serif text-xl text-bordeaux-950 shrink-0">&euro;{order.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 border-t border-cream-100 pt-3">
                    <ul className="space-y-1">
                      {order.items.map((item, i) => (
                        <li key={i} className="text-sm text-bordeaux-600 flex justify-between">
                          <span>{item.wine.nome} &times;{item.quantity}</span>
                          <span>&euro;{(item.wine.prezzo * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div>
          {searchHistory.length === 0 ? (
            <p className="text-bordeaux-500 text-center py-12">{t("account.no.history")}</p>
          ) : (
            <div className="space-y-2">
              {searchHistory.map((entry) => (
                <button key={entry.id} onClick={() => navigate(`/results?dish=${encodeURIComponent(entry.piatto)}`)}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors text-left">
                  <div>
                    <p className="text-sm font-medium text-bordeaux-950 capitalize">{entry.piatto}</p>
                    <p className="text-xs text-bordeaux-500">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-bordeaux-600">{entry.resultsCount} risultati</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "saved" && (
        <div>
          {savedWines.length === 0 ? (
            <p className="text-bordeaux-500 text-center py-12">{t("account.no.saved")}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedWines.map((wine) => (
                <WineCard key={wine.id} wine={wine} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "dashboard" && user.role === "ristoratore" && (
        <div className="bg-cream-50 rounded-xl border border-cream-200 p-6">
          <h2 className="font-serif text-xl text-bordeaux-950 mb-4">{t("account.dashboard")}</h2>
          <p className="text-sm text-bordeaux-600 mb-4">
            Gestisci la carta vini del tuo locale, aggiungi vini personalizzati e ricevi consigli AI per abbinare i vini al tuo men&ugrave;.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={() => navigate("/dashboard")} className="text-left p-4 rounded-lg bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
              <Store className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("restaurant.myWines")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">Aggiungi e gestisci i vini del tuo ristorante</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">Apri <ArrowRight className="w-3 h-3" /></span>
            </button>
            <button onClick={() => navigate("/dashboard")} className="text-left p-4 rounded-lg bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
              <History className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("restaurant.aiConsult")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">Descrivi il tuo men&ugrave; e ricevi suggerimenti</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">Apri <ArrowRight className="w-3 h-3" /></span>
            </button>
            <div className="p-4 rounded-lg bg-cream-100 border border-cream-200">
              <Heart className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">Statistiche</h3>
              <p className="text-xs text-bordeaux-500 mt-1">Analizza le ricerche e le preferenze</p>
            </div>
          </div>
        </div>
      )}

      {tab === "export" && user.role === "esportatore" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-bordeaux-950 text-cream-100">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-gold-400" />
              <div>
                <h2 className="font-serif text-xl text-cream-50">{user.ragioneSociale || user.nome}</h2>
                <p className="text-xs text-cream-300">{t("account.export.profile")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-cream-400">{t("account.export.vat")}</p><p className="text-cream-50 font-medium">{user.partitaIva || "&mdash;"}</p></div>
              <div><p className="text-xs text-cream-400">{t("account.export.country")}</p><p className="text-cream-50 font-medium">{user.paeseAttivita || "&mdash;"}</p></div>
              <div><p className="text-xs text-cream-400">{t("account.export.phone")}</p><p className="text-cream-50 font-medium">{user.telefono || "&mdash;"}</p></div>
              <div><p className="text-xs text-cream-400">Email</p><p className="text-cream-50 font-medium">{user.email}</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200"><FileText className="w-5 h-5 text-bordeaux-600 mb-2" /><p className="text-xs text-bordeaux-500">{t("account.export.rfqSent")}</p><p className="font-serif text-2xl text-bordeaux-950 mt-1">0</p></div>
            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200"><BarChart3 className="w-5 h-5 text-bordeaux-600 mb-2" /><p className="text-xs text-bordeaux-500">{t("account.export.rfqActive")}</p><p className="font-serif text-2xl text-bordeaux-950 mt-1">0</p></div>
            <div className="p-5 rounded-xl bg-bordeaux-50 border border-bordeaux-200"><Globe2 className="w-5 h-5 text-bordeaux-600 mb-2" /><p className="text-xs text-bordeaux-500">{t("account.export.wineriesContacted")}</p><p className="font-serif text-2xl text-bordeaux-950 mt-1">0</p></div>
            <div className="p-5 rounded-xl bg-gold-50 border border-gold-200"><Package className="w-5 h-5 text-bordeaux-600 mb-2" /><p className="text-xs text-bordeaux-500">{t("account.export.ordersValue")}</p><p className="font-serif text-2xl text-bordeaux-950 mt-1">&euro;0</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={() => navigate("/ai-matching")} className="text-left p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors group">
              <Globe2 className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("account.export.aiMatch")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">{t("account.export.aiMatchDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">{t("export.cta")} <ArrowRight className="w-3 h-3" /></span>
            </button>
            <button onClick={() => navigate("/rfq")} className="text-left p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors group">
              <FileText className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("account.export.newRfq")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">{t("account.export.newRfqDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">{t("export.cta")} <ArrowRight className="w-3 h-3" /></span>
            </button>
            <button onClick={() => navigate("/cantine")} className="text-left p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors group">
              <Building2 className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("account.export.directory")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">{t("account.export.directoryDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">{t("export.cta")} <ArrowRight className="w-3 h-3" /></span>
            </button>
          </div>
          <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-4">{t("account.export.directContacts")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-bordeaux-100 flex items-center justify-center"><Mail className="w-5 h-5 text-bordeaux-700" /></div><div><p className="text-xs text-bordeaux-500">Email export</p><p className="text-sm font-semibold text-bordeaux-950">export@bf45wine.com</p></div></div>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-bordeaux-100 flex items-center justify-center"><Phone className="w-5 h-5 text-bordeaux-700" /></div><div><p className="text-xs text-bordeaux-500">Telefono export</p><p className="text-sm font-semibold text-bordeaux-950">+39 0385 000 000</p></div></div>
            </div>
          </div>
        </div>
      )}

      {tab === "cantina" && user.role === "cantina" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-bordeaux-950 text-cream-100">
            <div className="flex items-center gap-3 mb-4">
              <Wine className="w-6 h-6 text-gold-400" />
              <div>
                <h2 className="font-serif text-xl text-cream-50">{user.ragioneSociale || user.nome}</h2>
                <p className="text-xs text-cream-300">{t("account.cantina.profile")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-cream-400">{t("account.cantina.vat")}</p><p className="text-cream-50 font-medium">{user.partitaIva || "&mdash;"}</p></div>
              <div><p className="text-xs text-cream-400">{t("account.cantina.phone")}</p><p className="text-cream-50 font-medium">{user.telefono || "&mdash;"}</p></div>
              <div><p className="text-xs text-cream-400">Email</p><p className="text-cream-50 font-medium">{user.email}</p></div>
              <div><p className="text-xs text-cream-400">{t("account.cantina.plan")}</p><p className="text-cream-50 font-medium">{t("account.cantina.planFree")}</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200"><Wine className="w-5 h-5 text-bordeaux-600 mb-2" /><p className="text-xs text-bordeaux-500">{t("account.cantina.myWines")}</p><p className="font-serif text-2xl text-bordeaux-950 mt-1">0</p></div>
            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200"><FileText className="w-5 h-5 text-bordeaux-600 mb-2" /><p className="text-xs text-bordeaux-500">{t("account.cantina.rfqReceived")}</p><p className="font-serif text-2xl text-bordeaux-950 mt-1">0</p></div>
            <div className="p-5 rounded-xl bg-bordeaux-50 border border-bordeaux-200"><BarChart3 className="w-5 h-5 text-bordeaux-600 mb-2" /><p className="text-xs text-bordeaux-500">{t("account.cantina.profileViews")}</p><p className="font-serif text-2xl text-bordeaux-950 mt-1">0</p></div>
            <div className="p-5 rounded-xl bg-gold-50 border border-gold-200"><Globe2 className="w-5 h-5 text-bordeaux-600 mb-2" /><p className="text-xs text-bordeaux-500">{t("account.cantina.exportReady")}</p><p className="font-serif text-2xl text-bordeaux-950 mt-1">{t("account.cantina.yes")}</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={() => navigate("/gestione-cantina")} className="text-left p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors group">
              <Wine className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("account.cantina.manageWines")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">{t("account.cantina.manageWinesDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">{t("export.cta")} <ArrowRight className="w-3 h-3" /></span>
            </button>
            <button onClick={() => navigate("/qr-cantina")} className="text-left p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors group">
              <FileText className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("account.cantina.qrPanel")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">{t("account.cantina.qrPanelDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">{t("export.cta")} <ArrowRight className="w-3 h-3" /></span>
            </button>
            <button onClick={() => navigate("/premium-cantina")} className="text-left p-5 rounded-xl bg-gold-50 border border-gold-300 hover:border-gold-400 transition-colors group">
              <Zap className="w-6 h-6 text-gold-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("account.cantina.upgradeTitle")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">{t("account.cantina.upgradeDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">{t("export.cta")} <ArrowRight className="w-3 h-3" /></span>
            </button>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-r from-gold-50 to-cream-100 border border-gold-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-gold-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950">{t("account.cantina.upgradeTitle")}</h3>
                <p className="text-sm text-bordeaux-600 mt-1">{t("account.cantina.upgradeDesc")}</p>
                <ul className="text-xs text-bordeaux-500 mt-2 space-y-1">
                  <li className="flex items-center gap-1.5"><Package className="w-3 h-3 text-gold-600" /> {t("account.cantina.upgradeF1")}</li>
                  <li className="flex items-center gap-1.5"><BarChart3 className="w-3 h-3 text-gold-600" /> {t("account.cantina.upgradeF2")}</li>
                  <li className="flex items-center gap-1.5"><Globe2 className="w-3 h-3 text-gold-600" /> {t("account.cantina.upgradeF3")}</li>
                </ul>
                <button onClick={() => navigate("/premium-cantina")} className="mt-3 px-4 py-2 rounded-lg bg-gold-400 text-bordeaux-950 text-sm font-semibold hover:bg-gold-300 transition-colors">
                  {t("account.cantina.upgradeBtn")}
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-4">{t("account.cantina.directContacts")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-bordeaux-100 flex items-center justify-center"><Mail className="w-5 h-5 text-bordeaux-700" /></div><div><p className="text-xs text-bordeaux-500">Email cantine</p><p className="text-sm font-semibold text-bordeaux-950">cantina@bf45wine.com</p></div></div>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-bordeaux-100 flex items-center justify-center"><Phone className="w-5 h-5 text-bordeaux-700" /></div><div><p className="text-xs text-bordeaux-500">Telefono cantine</p><p className="text-sm font-semibold text-bordeaux-950">+39 0385 222 222</p></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
