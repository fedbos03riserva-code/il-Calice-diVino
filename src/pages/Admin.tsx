import { useState } from "react";
import { Shield, Package, Mail, Star, Users, Search, TrendingUp, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";

const ADMIN_EMAIL = "federico.bosoni@gmail.com";

type Tab = "ordini" | "iscrizioni" | "recensioni" | "ricerche" | "panoramica";

export default function Admin() {
  const { user, orders, reviews, searchHistory, restaurantWines, savedWines, cart } = useApp();
  const [tab, setTab] = useState<Tab>("panoramica");
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Lock className="w-12 h-12 text-bordeaux-400 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-bordeaux-950">Area riservata</h1>
        <p className="text-bordeaux-600 mt-2 text-sm">Devi aver effettuato l'accesso per visualizzare questa pagina.</p>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Lock className="w-12 h-12 text-bordeaux-400 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-bordeaux-950">Accesso negato</h1>
        <p className="text-bordeaux-600 mt-2 text-sm">Questa area è riservata all'amministratore.</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <Shield className="w-10 h-10 text-gold-400 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-cream-50 text-center">Pannello di controllo</h1>
          <p className="text-sm text-cream-300 text-center mt-2">Inserisci la password per accedere.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (password === "bf45-admin") { setUnlocked(true); setError(false); } else { setError(true); } }}
            className="mt-6"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password amministratore"
              className="w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            {error && <p className="text-xs text-red-400 mt-2">Password errata. Riprova.</p>}
            <button type="submit" className="w-full mt-3 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors">
              Accedi
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "panoramica", label: "Panoramica", icon: TrendingUp },
    { id: "ordini", label: "Ordini", icon: Package },
    { id: "iscrizioni", label: "Iscrizioni", icon: Mail },
    { id: "recensioni", label: "Recensioni", icon: Star },
    { id: "ricerche", label: "Ricerche", icon: Search },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-7 h-7 text-gold-600" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600">Admin</p>
          <h1 className="font-serif text-3xl text-bordeaux-950">Pannello di controllo</h1>
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
          </button>
        ))}
      </div>

      {/* Panoramica */}
      {tab === "panoramica" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Package} label="Ordini totali" value={String(orders.length)} />
          <StatCard icon={TrendingUp} label="Ricavi totali" value={`€${totalRevenue.toFixed(2)}`} />
          <StatCard icon={Star} label="Recensioni" value={String(reviews.length)} />
          <StatCard icon={Users} label="Vini salvati" value={String(savedWines.length)} />
          <StatCard icon={Search} label="Ricerche effettuate" value={String(searchHistory.length)} />
          <StatCard icon={Mail} label="Vini ristorante" value={String(restaurantWines.length)} />
          <StatCard icon={Star} label="Valutazione media" value={avgRating} />
          <StatCard icon={Package} label="Carrello attivo" value={String(cart.length)} />
        </div>
      )}

      {/* Ordini */}
      {tab === "ordini" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <EmptyState icon={Package} text="Nessun ordine registrato." />
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
                    <p className="text-sm text-bordeaux-600 mt-1">
                      {order.address}, {order.zip} {order.city}, {order.country}
                    </p>
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
                        <span>{item.wine.nome} ×{item.quantity}</span>
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

      {/* Iscrizioni */}
      {tab === "iscrizioni" && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-bordeaux-600" />
              <div>
                <h3 className="font-serif text-lg text-bordeaux-950">{user.nome}</h3>
                <p className="text-sm text-bordeaux-600">{user.email}</p>
                <p className="text-xs text-bordeaux-500 mt-1">Ruolo: {user.role}</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-lg text-bordeaux-950 mb-3">Vini gestiti da ristoratori</h3>
            {restaurantWines.length === 0 ? (
              <p className="text-sm text-bordeaux-500">Nessun vino caricato dai ristoratori.</p>
            ) : (
              <ul className="space-y-2">
                {restaurantWines.map((w) => (
                  <li key={w.id} className="text-sm text-bordeaux-700 flex justify-between border-b border-cream-100 pb-2">
                    <span>{w.nome} · {w.regione} · {w.tipo}</span>
                    <span>€{w.prezzo.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Recensioni */}
      {tab === "recensioni" && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <EmptyState icon={Star} text="Nessuna recensione." />
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
            <EmptyState icon={Search} text="Nessuna ricerca registrata." />
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
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
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
