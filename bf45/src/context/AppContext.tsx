import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Language, User, CartItem, Wine, SearchHistoryEntry } from "../types/wine";
import { translate } from "../i18n/translations";

interface AppContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  user: User | null;
  login: (email: string, nome: string, role: "privato" | "ristoratore") => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (wine: Wine, qty?: number) => void;
  removeFromCart: (wineId: string) => void;
  updateQty: (wineId: string, qty: number) => void;
  cartTotal: number;
  cartCount: number;
  savedWines: Wine[];
  toggleSaveWine: (wine: Wine) => void;
  isSaved: (wineId: string) => boolean;
  searchHistory: SearchHistoryEntry[];
  addSearchHistory: (entry: Omit<SearchHistoryEntry, "id" | "timestamp">) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("it");
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedWines, setSavedWines] = useState<Wine[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bf45_state");
    if (stored) {
      try {
        const s = JSON.parse(stored);
        if (s.lang) setLangState(s.lang);
        if (s.user) setUser(s.user);
        if (s.cart) setCart(s.cart);
        if (s.savedWines) setSavedWines(s.savedWines);
        if (s.searchHistory) setSearchHistory(s.searchHistory);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bf45_state", JSON.stringify({ lang, user, cart, savedWines, searchHistory }));
  }, [lang, user, cart, savedWines, searchHistory]);

  const setLang = (l: Language) => setLangState(l);
  const t = (key: string) => translate(lang, key);

  const login = (email: string, nome: string, role: "privato" | "ristoratore") => {
    setUser({ id: crypto.randomUUID(), email, nome, role });
  };

  const logout = () => setUser(null);

  const addToCart = (wine: Wine, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.wine.id === wine.id);
      if (existing) {
        return prev.map((c) => c.wine.id === wine.id ? { ...c, quantity: c.quantity + qty } : c);
      }
      return [...prev, { wine, quantity: qty }];
    });
  };

  const removeFromCart = (wineId: string) => {
    setCart((prev) => prev.filter((c) => c.wine.id !== wineId));
  };

  const updateQty = (wineId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(wineId); return; }
    setCart((prev) => prev.map((c) => c.wine.id === wineId ? { ...c, quantity: qty } : c));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.wine.prezzo * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const toggleSaveWine = (wine: Wine) => {
    setSavedWines((prev) => {
      if (prev.some((w) => w.id === wine.id)) {
        return prev.filter((w) => w.id !== wine.id);
      }
      return [...prev, wine];
    });
  };

  const isSaved = (wineId: string) => savedWines.some((w) => w.id === wineId);

  const addSearchHistory = (entry: Omit<SearchHistoryEntry, "id" | "timestamp">) => {
    setSearchHistory((prev) => [
      { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
      ...prev.slice(0, 19),
    ]);
  };

  return (
    <AppContext.Provider value={{
      lang, setLang, t, user, login, logout,
      cart, addToCart, removeFromCart, updateQty, cartTotal, cartCount,
      savedWines, toggleSaveWine, isSaved, searchHistory, addSearchHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
