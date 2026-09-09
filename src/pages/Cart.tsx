import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const { t, cart, removeFromCart, updateQty, cartTotal } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-200 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-bordeaux-400" />
        </div>
        <h1 className="font-serif text-2xl text-bordeaux-950 mb-2">{t("cart.title")}</h1>
        <p className="text-bordeaux-600 mb-6">{t("cart.empty")}</p>
        <button
          onClick={() => navigate("/catalog")}
          className="px-6 py-3 rounded-xl bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors"
        >
          {t("nav.catalog")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-serif text-3xl text-bordeaux-950 mb-6">{t("cart.title")}</h1>

      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div
            key={item.wine.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-cream-50 border border-cream-200"
          >
            <div className="w-10 h-24 rounded-t bg-bordeaux-700 shrink-0 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-5 bg-bordeaux-950 rounded-t" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-sm font-semibold text-bordeaux-950 line-clamp-2">{item.wine.nome}</h3>
              <p className="text-xs text-bordeaux-600">{item.wine.regione} &middot; {item.wine.tipo}</p>
              <p className="text-sm font-semibold text-bordeaux-800 mt-1">&euro;{item.wine.prezzo.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.wine.id, item.quantity - 1)}
                className="w-7 h-7 rounded-full bg-cream-200 text-bordeaux-700 hover:bg-cream-300 transition-colors text-sm"
              >
                &minus;
              </button>
              <span className="text-sm font-medium text-bordeaux-950 w-6 text-center tabular-nums">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.wine.id, item.quantity + 1)}
                className="w-7 h-7 rounded-full bg-cream-200 text-bordeaux-700 hover:bg-cream-300 transition-colors text-sm"
              >
                +
              </button>
            </div>
            <span className="text-sm font-semibold text-bordeaux-950 w-20 text-right tabular-nums">
              &euro;{(item.wine.prezzo * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeFromCart(item.wine.id)}
              className="p-2 text-bordeaux-400 hover:text-bordeaux-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-cream-100 border border-cream-200">
        <span className="font-serif text-lg text-bordeaux-950">{t("cart.total")}</span>
        <span className="font-serif text-2xl font-bold text-bordeaux-950 tabular-nums">&euro;{cartTotal.toFixed(2)}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-4 py-4 rounded-xl bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2 group"
      >
        {t("cart.checkout")}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cream-50 border border-cream-200">
          <span className="text-base">🔒</span>
          <div>
            <p className="text-xs font-semibold text-bordeaux-800">Pagamento sicuro</p>
            <p className="text-xs text-bordeaux-500">Stripe</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cream-50 border border-cream-200">
          <span className="text-base">🚚</span>
          <div>
            <p className="text-xs font-semibold text-bordeaux-800">Spedizione 24/48h</p>
            <p className="text-xs text-bordeaux-500">Gratuita oltre 60€</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cream-50 border border-cream-200">
          <span className="text-base">↩️</span>
          <div>
            <p className="text-xs font-semibold text-bordeaux-800">Reso gratuito</p>
            <p className="text-xs text-bordeaux-500">Entro 30 giorni</p>
          </div>
        </div>
      </div>
    </div>
  );
}
