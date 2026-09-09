import { Plus, Heart } from "lucide-react";
import type { Wine } from "../types/wine";
import { useApp } from "../context/AppContext";

interface WineCardProps {
  wine: Wine;
  onAddToCart?: (wine: Wine) => void;
  compact?: boolean;
}

const typeColors: Record<string, string> = {
  Rosso: "bg-bordeaux-700",
  Bianco: "bg-gold-400",
  Rosato: "bg-bordeaux-400",
  Spumante: "bg-cream-400",
  Dolce: "bg-gold-600",
};

const typeText: Record<string, string> = {
  Rosso: "text-cream-50",
  Bianco: "text-bordeaux-950",
  Rosato: "text-cream-50",
  Spumante: "text-bordeaux-950",
  Dolce: "text-cream-50",
};

export default function WineCard({ wine, onAddToCart, compact }: WineCardProps) {
  const { t, addToCart, toggleSaveWine, isSaved } = useApp();

  return (
    <div className="group bg-cream-50 rounded-xl border border-cream-200 overflow-hidden hover:shadow-lg hover:border-gold-300 transition-all duration-300">
      {/* Bottle representation */}
      <div className="relative h-40 bg-gradient-to-b from-cream-100 to-cream-200 flex items-end justify-center pb-4">
        <div
          className={`w-12 h-28 rounded-t-lg ${typeColors[wine.tipo] || "bg-bordeaux-700"} group-hover:scale-105 transition-transform duration-300 relative`}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-6 bg-bordeaux-950 rounded-t" />
          <div className={`absolute top-7 left-1/2 -translate-x-1/2 ${typeText[wine.tipo]} text-[8px] font-serif rotate-180 whitespace-nowrap`}
            style={{ writingMode: "vertical-rl" }}>
            {wine.nome.slice(0, 20)}
          </div>
        </div>
        <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-bordeaux-950 text-cream-100 font-medium">
          {wine.fascia}
        </span>
        <button
          onClick={() => toggleSaveWine(wine)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-cream-50/80 hover:bg-cream-50 transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isSaved(wine.id) ? "fill-bordeaux-600 text-bordeaux-600" : "text-bordeaux-400"}`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-base font-semibold text-bordeaux-950 line-clamp-2 leading-tight">
          {wine.nome}
        </h3>
        <p className="text-xs text-bordeaux-600 mt-1">
          {wine.regione} &middot; {wine.continente}
        </p>
        {!compact && (
          <div className="flex flex-wrap gap-1 mt-2">
            {wine.profilo_aromatico.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream-200 text-bordeaux-700">
                {a}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-serif font-semibold text-bordeaux-800">
            &euro;{wine.prezzo.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart ? onAddToCart(wine) : addToCart(wine)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            {t("catalog.addtocart")}
          </button>
        </div>
      </div>
    </div>
  );
}
