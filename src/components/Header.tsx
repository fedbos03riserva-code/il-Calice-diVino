import { useState } from "react";
import { Link } from "react-router-dom";
import { Wine, ShoppingCart, User, Menu, X, Globe, ChevronDown, Home as HomeIcon, Beaker, ChefHat, Sparkles, Store, LayoutDashboard, Shield, Info, QrCode, Calendar, Building2, FileText, Briefcase, Map as MapIcon, Package, BarChart3, FileSpreadsheet, Zap, Settings, Search, HelpCircle, ClipboardList, Grape } from "lucide-react";
import { useApp } from "../context/AppContext";
import { LANGUAGES } from "../i18n/translations";
import type { Language } from "../types/wine";

export default function Header() {
  const { t, lang, setLang, cartCount } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const privatiItems = [
    { to: "/abbinamenti", label: t("nav.abbinamenti"), icon: Search },
    { to: "/quiz", label: t("nav.quiz"), icon: Sparkles },
    { to: "/wine-lab", label: t("nav.winelab"), icon: Beaker },
    { to: "/reverse", label: t("nav.reverse"), icon: ChefHat },
    { to: "/premium", label: t("nav.premium"), icon: Sparkles },
  ];

  const cantinaItems = [
    { to: "/catalog?regione=Oltrepò+Pavese", label: t("catalog.tabOltrepo"), icon: Wine },
    { to: "/vitigni", label: "Guida Vitigni", icon: Grape },
  ];

  const cantinaMenuItems = [
    { to: "/gestione-cantina", label: t("nav.cantinaManagement"), icon: Store },
    { to: "/qr-cantina", label: t("qr.panel.title"), icon: Settings },
    { to: "/cantine", label: t("nav.directory"), icon: Building2 },
    { to: "/mappa", label: t("nav.map"), icon: MapIcon },
  ];

  const esportatoreItems = [
    { to: "/export-guida", label: t("nav.exportGuide"), icon: HelpCircle },
    { to: "/ai-matching", label: t("nav.aiMatching"), icon: Zap },
    { to: "/rfq", label: t("nav.rfq"), icon: FileText },
    { to: "/export-process", label: t("nav.exportProcess"), icon: Package },
    { to: "/materiali-b2b", label: t("nav.materials"), icon: FileSpreadsheet },
  ];

  const businessItems = [
    { to: "/b2b", label: "BF45 Business", icon: Store },
    { to: "/carta-ai", label: "Carta Vini AI", icon: ClipboardList },
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/analytics", label: t("nav.analytics"), icon: BarChart3 },
    { to: "/qr-menu", label: t("nav.qrmenu"), icon: QrCode },
    { to: "/consulenza-privata", label: t("nav.consulting"), icon: User },
  ];

  const eventiItems = [
    { to: "/eventi", label: t("nav.events"), icon: Calendar },
  ];

  const altroItems = [
    { to: "/about", label: t("nav.about"), icon: Info },
    { to: "/about", label: t("nav.workWithUs"), icon: Briefcase },
    { to: "/business-plan", label: t("nav.businessPlan"), icon: FileText },
    { to: "/admin", label: t("nav.admin"), icon: Shield },
  ];

  const menus = [
    { key: "privati", label: t("nav.privati"), items: privatiItems },
    { key: "cantina", label: t("nav.cantina"), items: cantinaMenuItems },
    { key: "esportatori", label: t("nav.esportatori"), items: esportatoreItems },
    { key: "catalog", label: t("nav.catalog"), items: cantinaItems },
    { key: "eventi", label: t("nav.events"), items: eventiItems },
    { key: "business", label: t("nav.business"), items: businessItems },
    { key: "altro", label: t("nav.altro"), items: altroItems },
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

          <nav className="hidden md:flex items-center gap-4 lg:gap-5">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-cream-200 hover:text-gold-400 transition-colors font-medium py-2">
              <HomeIcon className="w-4 h-4 text-gold-400/70" />
              {t("nav.home")}
            </Link>

            {menus.map((menu) => (
              <div
                key={menu.key}
                className="relative"
                onMouseEnter={() => setOpenMenu(menu.key)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="flex items-center gap-1 text-sm text-cream-200 hover:text-gold-400 transition-colors font-medium py-2">
                  {menu.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === menu.key ? "rotate-180" : ""}`} />
                </button>
                {openMenu === menu.key && (
                  <div className={`absolute top-full pt-1 w-56 ${menu.key === "altro" ? "right-0" : "left-0"}`}>
                    <div className="bg-bordeaux-900 border border-gold-700/30 rounded-xl shadow-2xl py-2 animate-scale-in max-h-[80vh] overflow-y-auto">
                      {menu.items.map((item) => (
                        <Link key={item.to + item.label} to={item.to} onClick={() => setOpenMenu(null)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cream-200 hover:bg-bordeaux-800 hover:text-gold-400 transition-colors">
                          <item.icon className="w-4 h-4 text-gold-400/70" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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
            <Link to="/" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm text-cream-200 hover:text-gold-400 py-2 px-2">
              <HomeIcon className="w-4 h-4 text-gold-400/60" />
              {t("nav.home")}
            </Link>
            {menus.map((menu) => (
              <div key={menu.key}>
                <p className="text-xs text-gold-400 uppercase tracking-wider px-2 pt-3 pb-1">{menu.label}</p>
                {menu.items.map((item) => (
                  <Link key={item.to + item.label} to={item.to} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm text-cream-200 hover:text-gold-400 py-2 px-2">
                    <item.icon className="w-4 h-4 text-gold-400/60" />
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
