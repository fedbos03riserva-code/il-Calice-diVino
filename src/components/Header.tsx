import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wine, ShoppingCart, User, Menu, X, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";
import { LANGUAGES } from "../i18n/translations";
import type { Language } from "../types/wine";

export default function Header() {
  const { t, lang, setLang, cartCount, user } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/catalog", label: t("nav.catalog") },
    { to: "/account", label: t("nav.account") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-bordeaux-950/95 backdrop-blur-md border-b border-gold-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Wine className="w-7 h-7 text-gold-400 group-hover:text-gold-300 transition-colors" />
            <span className="font-serif text-xl font-semibold text-cream-50 tracking-tight">
              B<span className="text-gold-400">&amp;</span>F <span className="text-gold-400">45</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm text-cream-200 hover:text-gold-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-cream-200 hover:text-gold-400 transition-colors text-sm px-2 py-1"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{lang}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-40 bg-bordeaux-900 border border-gold-700/30 rounded-lg shadow-xl py-1 animate-scale-in">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code as Language); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          lang === l.code ? "text-gold-400 bg-bordeaux-800" : "text-cream-200 hover:bg-bordeaux-800"
                        }`}
                      >
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative text-cream-200 hover:text-gold-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-400 text-bordeaux-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <Link to="/account" className="text-cream-200 hover:text-gold-400 transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-cream-200 hover:text-gold-400"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-cream-200 hover:text-gold-400 py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
