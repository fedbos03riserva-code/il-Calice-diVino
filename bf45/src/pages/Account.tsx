import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, History, Heart, Store, LogOut, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import WineCard from "../components/WineCard";
import type { UserRole } from "../types/wine";

export default function Account() {
  const { t, user, login, logout, savedWines, searchHistory } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("privato");
  const [tab, setTab] = useState<"history" | "saved" | "dashboard">("history");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nome) return;
    login(email, nome, role);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bordeaux-800 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="font-serif text-2xl text-bordeaux-950">{t("account.title")}</h1>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "login" ? "bg-bordeaux-800 text-cream-50" : "bg-cream-100 text-bordeaux-700"}`}
            >
              {t("account.login")}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "register" ? "bg-bordeaux-800 text-cream-50" : "bg-cream-100 text-bordeaux-700"}`}
            >
              {t("account.register")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs text-bordeaux-600 block mb-1">{t("account.name")}</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("account.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("account.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>
            {mode === "register" && (
              <div>
                <label className="text-xs text-bordeaux-600 block mb-1">{t("account.role")}</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("privato")}
                    className={`flex-1 py-2.5 rounded-lg text-sm transition-colors ${role === "privato" ? "bg-bordeaux-800 text-cream-50" : "bg-cream-100 text-bordeaux-700"}`}
                  >
                    {t("account.role.privato")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("ristoratore")}
                    className={`flex-1 py-2.5 rounded-lg text-sm transition-colors ${role === "ristoratore" ? "bg-bordeaux-800 text-cream-50" : "bg-cream-100 text-bordeaux-700"}`}
                  >
                    {t("account.role.ristoratore")}
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors"
            >
              {mode === "login" ? t("account.login") : t("account.register")}
            </button>
          </form>
          <p className="text-xs text-bordeaux-400 text-center mt-4">
            Modalit&agrave; DEMO — nessun dato reale viene salvato su server.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "history" as const, label: t("account.history"), icon: History },
    { id: "saved" as const, label: t("account.saved"), icon: Heart },
    ...(user.role === "ristoratore" ? [{ id: "dashboard" as const, label: t("account.dashboard"), icon: Store }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Profile header */}
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
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-bordeaux-600 hover:text-bordeaux-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("account.logout")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-cream-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === tabs.find((tb) => tb.id === tab.id) && tab.id === tab.id
                ? "border-bordeaux-800 text-bordeaux-950"
                : "border-transparent text-bordeaux-500 hover:text-bordeaux-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "history" && (
        <div>
          {searchHistory.length === 0 ? (
            <p className="text-bordeaux-500 text-center py-12">{t("account.no.history")}</p>
          ) : (
            <div className="space-y-2">
              {searchHistory.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => navigate(`/results?dish=${encodeURIComponent(entry.piatto)}`)}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors text-left"
                >
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
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">
                Apri <ArrowRight className="w-3 h-3" />
              </span>
            </button>
            <button onClick={() => navigate("/dashboard")} className="text-left p-4 rounded-lg bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
              <History className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">{t("restaurant.aiConsult")}</h3>
              <p className="text-xs text-bordeaux-500 mt-1">Descrivi il tuo men&ugrave; e ricevi suggerimenti</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-2 group-hover:text-gold-600 transition-colors">
                Apri <ArrowRight className="w-3 h-3" />
              </span>
            </button>
            <div className="p-4 rounded-lg bg-cream-100 border border-cream-200">
              <Heart className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h3 className="font-serif text-base text-bordeaux-950">Statistiche</h3>
              <p className="text-xs text-bordeaux-500 mt-1">Analizza le ricerche e le preferenze</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
