import { useState } from "react";
import { Link } from "react-router-dom";
import { Wine, ShoppingCart, User, Menu, X, Globe, ChevronDown, Home as HomeIcon, BookOpen, Beaker, ChefHat, Sparkles, Store, LayoutDashboard, Shield, Info } from "lucide-react";
import { useApp } from "../context/AppContext";
import { LANGUAGES } from "../i18n/translations";
import type { Language } from "../types/wine";

export default function Header() {
  const { t, lang, setLang, cartCount } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [privatiOpen, setPrivatiOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [altroOpen, setAltroOpen] = useState(false);

  const privatiItems = [
    { to: "/", label: t("nav.home"), icon: HomeIcon },
    { to: "/catalog", label: t("nav.catalog"), icon: BookOpen },
    { to: "/quiz", label: t("nav.quiz"), icon: Sparkles },
    { to: "/wine-lab", label: t("nav.winelab"), icon: Beaker },
    { to: "/reverse", label: t("nav.reverse"), icon: ChefHat },
    { to: "/premium", label: t("nav.premium"), icon: Sparkles },
  ];

  const businessItems = [
    { to: "/b2b", label: t("b2b.subtitle"), icon: Store },
    { to: "/consulenza-privata", label: t("nav.consulting"), icon: User },
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
  ];

  const altroItems = [
    { to: "/about", label: t("nav.about"), icon: Info },
    { to: "/admin", label: t("nav.admin"), icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 bg-bordeaux-950/95 backdrop-blur-md border-b border-gold-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Wine className="w-7 h-7 text-gold-400 group-hover:text-gold-300 transition-colors" />
            <span className="font-serif text-xl font-semibold text-cream-50 tracking-tight">
              B<span className="text-gold-400">&amp;</span>F <span className="text-gold-400">45</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <div className="relative" onMouseEnter={() => { setPrivatiOpen(true); setBusinessOpen(false); setAltroOpen(false); }} onMouseLeave={() => setPrivatiOpen(false)}>
              <button className="flex items-center gap-1 text-sm text-cream-200 hover:text-gold-400 transition-colors font-medium py-2">
                {t("nav.privati")}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${privatiOpen ? "rotate-180" : ""}`} />
              </button>
              {privatiOpen && (
                <div className="absolute top-full left-0 pt-1 w-56">
                  <div className="bg-bordeaux-900 border border-gold-700/30 rounded-xl shadow-2xl py-2 animate-scale-in">
                    {privatiItems.map((item) => (
                      <Link key={item.to} to={item.to} onClick={() => setPrivatiOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cream-200 hover:bg-bordeaux-800 hover:text-gold-400 transition-colors">
                        <item.icon className="w-4 h-4 text-gold-400/70" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => { setBusinessOpen(true); setPrivatiOpen(false); setAltroOpen(false); }} onMouseLeave={() => setBusinessOpen(false)}>
              <button className="flex items-center gap-1 text-sm text-cream-200 hover:text-gold-400 transition-colors font-medium py-2">
                {t("nav.business")}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${businessOpen ? "rotate-180" : ""}`} />
              </button>
              {businessOpen && (
                <div className="absolute top-full left-0 pt-1 w-56">
                  <div className="bg-bordeaux-900 border border-gold-700/30 rounded-xl shadow-2xl py-2 animate-scale-in">
                    {businessItems.map((item) => (
                      <Link key={item.to} to={item.to} onClick={() => setBusinessOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cream-200 hover:bg-bordeaux-800 hover:text-gold-400 transition-colors">
                        <item.icon className="w-4 h-4 text-gold-400/70" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => { setAltroOpen(true); setPrivatiOpen(false); setBusinessOpen(false); }} onMouseLeave={() => setAltroOpen(false)}>
              <button className="flex items-center gap-1 text-sm text-cream-200 hover:text-gold-400 transition-colors font-medium py-2">
                {t("nav.altro")}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${altroOpen ? "rotate-180" : ""}`} />
              </button>
              {altroOpen && (
                <div className="absolute top-full right-0 pt-1 w-56">
                  <div className="bg-bordeaux-900 border border-gold-700/30 rounded-xl shadow-2xl py-2 animate-scale-in">
                    {altroItems.map((item) => (
                      <Link key={item.to} to={item.to} onClick={() => setAltroOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cream-200 hover:bg-bordeaux-800 hover:text-gold-400 transition-colors">
                        <item.icon className="w-4 h-4 text-gold-400/70" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-cream-200 hover:text-gold-400 transition-colors text-sm px-2 py-1">
                <Globe className="w-4 h-4" />
                <span className="uppercase">{lang}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-40 bg-bordeaux-900 border border-gold-700/30 rounded-lg shadow-xl py-1 animate-scale-in">
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => { setLang(l.code as Language); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${lang === l.code ? "text-gold-400 bg-bordeaux-800" : "text-cream-200 hover:bg-bordeaux-800"}`}>
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link to="/cart" className="relative text-cream-200 hover:text-gold-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-400 text-bordeaux-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/account" className="text-cream-200 hover:text-gold-400 transition-colors">
              <User className="w-5 h-5" />
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-cream-200 hover:text-gold-400">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 animate-fade-in">
            <p className="text-xs text-gold-400 uppercase tracking-wider px-2 pt-2 pb-1">{t("nav.privati")}</p>
            {privatiItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-cream-200 hover:text-gold-400 py-2 px-2">
                <item.icon className="w-4 h-4 text-gold-400/60" />
                {item.label}
              </Link>
            ))}
            <p className="text-xs text-gold-400 uppercase tracking-wider px-2 pt-3 pb-1">{t("nav.business")}</p>
            {businessItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-cream-200 hover:text-gold-400 py-2 px-2">
                <item.icon className="w-4 h-4 text-gold-400/60" />
                {item.label}
              </Link>
            ))}
            <p className="text-xs text-gold-400 uppercase tracking-wider px-2 pt-3 pb-1">{t("nav.altro")}</p>
            {altroItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-cream-200 hover:text-gold-400 py-2 px-2">
                <item.icon className="w-4 h-4 text-gold-400/60" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
