import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Language, User, CartItem, Wine, SearchHistoryEntry, Review, RestaurantWine, Order } from "../types/wine";
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
  clearCart: () => void;
  savedWines: Wine[];
  toggleSaveWine: (wine: Wine) => void;
  isSaved: (wineId: string) => boolean;
  searchHistory: SearchHistoryEntry[];
  addSearchHistory: (entry: Omit<SearchHistoryEntry, "id" | "timestamp">) => void;
  reviews: Review[];
  addReview: (wineId: string, rating: number, text: string) => void;
  getWineReviews: (wineId: string) => Review[];
  getWineRating: (wineId: string) => { avg: number; count: number };
  markReviewHelpful: (reviewId: string) => void;
  canReview: (wineId: string) => boolean;
  restaurantWines: RestaurantWine[];
  addRestaurantWine: (wine: Omit<RestaurantWine, "id" | "ownerId">) => void;
  updateRestaurantWine: (id: string, wine: Partial<RestaurantWine>) => void;
  deleteRestaurantWine: (id: string) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "number" | "date">) => Order;
}

const AppContext = createContext<AppContextValue | null>(null);

// Seed demo reviews
const SEED_REVIEWS: Review[] = [
  { id: "r1", wineId: "NEW001", userId: "u_demo1", userName: "Marco R.", rating: 5, text: "Abbinato con arrosticini, semplicemente perfetto. Acidità tagliante e profumo di ciliegia.", timestamp: "2026-08-15T10:00:00Z", helpful: 12 },
  { id: "r2", wineId: "NEW001", userId: "u_demo2", userName: "Sofia B.", rating: 4, text: "Ottimo vino, forse leggermente caro ma la qualità si sente.", timestamp: "2026-08-20T14:30:00Z", helpful: 5 },
  { id: "r3", wineId: "NEW010", userId: "u_demo3", userName: "Luigi D.", rating: 5, text: "Con ragù napoletano è una rivelazione. Tannini potenti ma eleganti.", timestamp: "2026-07-30T09:15:00Z", helpful: 8 },
  { id: "r4", wineId: "NEW010", userId: "u_demo4", userName: "Anna P.", rating: 4, text: "Buono con agnello al forno. Lascia un retrogusto speziato gradevole.", timestamp: "2026-08-10T18:00:00Z", helpful: 3 },
  { id: "r5", wineId: "NEW005", userId: "u_demo5", userName: "Giulia M.", rating: 4, text: "Coniglio in porchetta perfetto. Rapporto qualità-prezzo ottimo.", timestamp: "2026-08-25T12:00:00Z", helpful: 6 },
  { id: "r6", wineId: "CHAM001", userId: "u_demo6", userName: "Pietro V.", rating: 5, text: "Con ostriche è il top. Bollicine fini e persistenti, brioche al naso.", timestamp: "2026-09-01T20:00:00Z", helpful: 15 },
  { id: "r7", wineId: "CHAM001", userId: "u_demo7", userName: "Elena F.", rating: 4, text: "Bollinger sempre una garanzia. Forse un po' caro ma per occasioni speciali vale la pena.", timestamp: "2026-08-28T16:00:00Z", helpful: 7 },
  { id: "r8", wineId: "XIT002", userId: "u_demo8", userName: "Roberto S.", rating: 5, text: "Amarone eccezionale. Con brasato d'asino è un'esperienza indimenticabile.", timestamp: "2026-09-03T19:30:00Z", helpful: 10 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("it");
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedWines, setSavedWines] = useState<Wine[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [restaurantWines, setRestaurantWines] = useState<RestaurantWine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

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
        if (s.reviews) setReviews([...SEED_REVIEWS, ...s.reviews.filter((r: Review) => !SEED_REVIEWS.some(sr => sr.id === r.id))]);
        if (s.restaurantWines) setRestaurantWines(s.restaurantWines);
        if (s.orders) setOrders(s.orders);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bf45_state", JSON.stringify({ lang, user, cart, savedWines, searchHistory, reviews: reviews.filter(r => !SEED_REVIEWS.some(sr => sr.id === r.id)), restaurantWines, orders }));
  }, [lang, user, cart, savedWines, searchHistory, reviews, restaurantWines, orders]);

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

  const clearCart = () => setCart([]);

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

  const addReview = (wineId: string, rating: number, text: string) => {
    if (!user) return;
    setReviews((prev) => [
      { id: crypto.randomUUID(), wineId, userId: user.id, userName: user.nome, rating, text, timestamp: new Date().toISOString(), helpful: 0 },
      ...prev,
    ]);
  };

  const getWineReviews = (wineId: string) => reviews.filter((r) => r.wineId === wineId);

  const getWineRating = (wineId: string) => {
    const rs = reviews.filter((r) => r.wineId === wineId);
    if (rs.length === 0) return { avg: 0, count: 0 };
    const avg = rs.reduce((s, r) => s + r.rating, 0) / rs.length;
    return { avg: Math.round(avg * 10) / 10, count: rs.length };
  };

  const markReviewHelpful = (reviewId: string) => {
    setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  };

  const canReview = (wineId: string) => {
    if (!user) return false;
    // Can review if wine was purchased (in orders) or searched before
    const inOrders = orders.some(o => o.items.some(i => i.wine.id === wineId));
    const inHistory = searchHistory.some(h => h.piatto.toLowerCase().includes(wineId.toLowerCase()));
    const inCart = cart.some(c => c.wine.id === wineId);
    const inSaved = savedWines.some(w => w.id === wineId);
    return inOrders || inHistory || inCart || inSaved;
  };

  const addRestaurantWine = (wine: Omit<RestaurantWine, "id" | "ownerId">) => {
    if (!user) return;
    setRestaurantWines((prev) => [
      { ...wine, id: crypto.randomUUID(), ownerId: user.id },
      ...prev,
    ]);
  };

  const updateRestaurantWine = (id: string, updates: Partial<RestaurantWine>) => {
    setRestaurantWines((prev) => prev.map((w) => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteRestaurantWine = (id: string) => {
    setRestaurantWines((prev) => prev.filter((w) => w.id !== id));
  };

  const addOrder = (order: Omit<Order, "number" | "date">): Order => {
    const newOrder: Order = {
      ...order,
      number: `BF45-${Date.now().toString(36).toUpperCase().slice(-8)}`,
      date: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <AppContext.Provider value={{
      lang, setLang, t, user, login, logout,
      cart, addToCart, removeFromCart, updateQty, cartTotal, cartCount, clearCart,
      savedWines, toggleSaveWine, isSaved, searchHistory, addSearchHistory,
      reviews, addReview, getWineReviews, getWineRating, markReviewHelpful, canReview,
      restaurantWines, addRestaurantWine, updateRestaurantWine, deleteRestaurantWine,
      orders, addOrder,
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
