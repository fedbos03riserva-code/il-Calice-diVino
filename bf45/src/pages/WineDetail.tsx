import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Heart, ThumbsUp, MapPin, Grape } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import type { Wine, Review } from "../types/wine";
import StarRating from "../components/StarRating";

const typeColors: Record<string, string> = {
  Rosso: "bg-bordeaux-700",
  Bianco: "bg-gold-400",
  Rosato: "bg-bordeaux-400",
  Spumante: "bg-cream-400",
  Dolce: "bg-gold-600",
};

export default function WineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, addToCart, toggleSaveWine, isSaved, user, getWineReviews, getWineRating, addReview, markReviewHelpful, canReview } = useApp();
  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "high" | "low">("recent");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadWineCatalog().then((cat) => {
      const found = cat.find((w) => w.id === id);
      setWine(found || null);
      setLoading(false);
    });
  }, [id]);

  const reviews = useMemo(() => {
    if (!wine) return [];
    let rs = [...getWineReviews(wine.id)];
    switch (sortBy) {
      case "recent": rs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)); break;
      case "helpful": rs.sort((a, b) => b.helpful - a.helpful); break;
      case "high": rs.sort((a, b) => b.rating - a.rating); break;
      case "low": rs.sort((a, b) => a.rating - b.rating); break;
    }
    return rs;
  }, [wine, getWineReviews, sortBy]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20"><div className="h-96 rounded-xl bg-cream-200 animate-pulse" /></div>;
  }

  if (!wine) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-bordeaux-600 text-lg">Vino non trovato</p>
        <button onClick={() => navigate("/catalog")} className="mt-4 px-6 py-3 rounded-xl bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
          {t("nav.catalog")}
        </button>
      </div>
    );
  }

  const { avg, count } = getWineRating(wine.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    addReview(wine.id, reviewRating, reviewText.trim());
    setReviewText("");
    setReviewRating(5);
    setShowReviewForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-bordeaux-600 hover:text-bordeaux-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("detail.back")}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bottle visual */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-cream-100 to-cream-200 rounded-2xl p-8 min-h-[320px]">
          <div className={`w-20 h-48 rounded-t-lg ${typeColors[wine.tipo] || "bg-bordeaux-700"} relative`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-10 bg-bordeaux-950 rounded-t" />
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-cream-50 text-[10px] font-serif whitespace-nowrap" style={{ writingMode: "vertical-rl" }}>
              {wine.nome.slice(0, 25)}
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-bordeaux-700 text-cream-50">{t(`type.${wine.tipo}`)}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gold-600 text-cream-50">{t(`price.${wine.fascia}`)}</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-bordeaux-950 leading-tight mb-2">{wine.nome}</h1>
          <p className="text-sm text-bordeaux-600 flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5" /> {wine.regione}, {wine.continente}</p>
          <p className="text-sm text-bordeaux-600 flex items-center gap-1 mb-4"><Grape className="w-3.5 h-3.5" /> {wine.uva}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={avg} size={20} />
            <span className="text-sm text-bordeaux-600">
              {count > 0 ? `${avg} ${t("detail.basedOn")} ${count} ${t("detail.reviewsWord")}` : t("detail.noRating")}
            </span>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-cream-100 border border-cream-200">
            <div><p className="text-xs text-bordeaux-500">{t("restaurant.wineAlcohol")}</p><p className="text-sm font-semibold text-bordeaux-950">{wine.alcol}%</p></div>
            <div><p className="text-xs text-bordeaux-500">{t("restaurant.wineAcidity")}</p><p className="text-sm font-semibold text-bordeaux-950 capitalize">{wine.acidita}</p></div>
            <div><p className="text-xs text-bordeaux-500">{t("restaurant.wineTannins")}</p><p className="text-sm font-semibold text-bordeaux-950 capitalize">{wine.tannini}</p></div>
            <div><p className="text-xs text-bordeaux-500">{t("restaurant.wineBody")}</p><p className="text-sm font-semibold text-bordeaux-950 capitalize">{wine.corpo}</p></div>
          </div>

          {/* Aromatic profile */}
          <div className="mb-4">
            <p className="text-xs text-bordeaux-500 mb-1">{t("restaurant.wineProfile")}</p>
            <div className="flex flex-wrap gap-1">
              {wine.profilo_aromatico.map((a) => (
                <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-bordeaux-700">{a}</span>
              ))}
            </div>
          </div>

          {/* Pairings */}
          <div className="mb-4">
            <p className="text-xs text-bordeaux-500 mb-1">{t("detail.pairings")}</p>
            <div className="flex flex-wrap gap-1">
              {wine.abbina_bene_con.map((a) => (
                <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{a}</span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-xs text-bordeaux-500 mb-1">{t("detail.notpairings")}</p>
            <div className="flex flex-wrap gap-1">
              {wine.non_abbina_con.map((a) => (
                <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">{a}</span>
              ))}
            </div>
          </div>

          {/* Price + actions */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-100 border border-cream-200">
            <span className="font-serif text-2xl font-bold text-bordeaux-950">&euro;{wine.prezzo.toFixed(2)}</span>
            <div className="flex gap-2">
              <button onClick={() => toggleSaveWine(wine)} className="p-2.5 rounded-lg bg-cream-200 hover:bg-cream-300 transition-colors">
                <Heart className={`w-5 h-5 ${isSaved(wine.id) ? "fill-bordeaux-600 text-bordeaux-600" : "text-bordeaux-400"}`} />
              </button>
              <button onClick={() => addToCart(wine)} className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" /> {t("results.addtocart")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-bordeaux-950">{t("detail.reviews")} ({count})</h2>
          {user && canReview(wine.id) && (
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-sm px-4 py-2 rounded-lg bg-gold-400 text-bordeaux-950 hover:bg-gold-300 transition-colors font-medium">
              {t("detail.writeReview")}
            </button>
          )}
        </div>

        {/* Review form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 rounded-xl bg-cream-100 border border-cream-200 animate-fade-in space-y-3">
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("detail.rating")}</label>
              <StarRating rating={reviewRating} size={28} interactive onChange={setReviewRating} />
            </div>
            <div>
              <label className="text-xs text-bordeaux-600 block mb-1">{t("detail.reviewText")}</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t("detail.reviewPlaceholder")}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
              {t("detail.submitReview")}
            </button>
          </form>
        )}

        {/* Cannot review notice */}
        {user && !canReview(wine.id) && (
          <p className="text-xs text-bordeaux-400 mb-4 italic">{t("detail.cannotReview")}</p>
        )}

        {/* Sort controls */}
        {reviews.length > 0 && (
          <div className="flex gap-2 mb-4">
            {([
              { id: "recent", label: t("detail.sortRecent") },
              { id: "helpful", label: t("detail.sortHelpful") },
              { id: "high", label: t("detail.sortHigh") },
              { id: "low", label: t("detail.sortLow") },
            ] as const).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${sortBy === opt.id ? "bg-bordeaux-800 text-cream-50" : "bg-cream-100 text-bordeaux-600 hover:bg-cream-200"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <p className="text-bordeaux-500 text-center py-8">{t("detail.noReviews")}</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} onHelpful={() => markReviewHelpful(review.id)} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review, onHelpful, t }: { review: Review; onHelpful: () => void; t: (k: string) => string }) {
  return (
    <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-bordeaux-700 text-cream-50 flex items-center justify-center text-xs font-semibold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-bordeaux-950">{review.userName}</p>
            <p className="text-xs text-bordeaux-500">{new Date(review.timestamp).toLocaleDateString()}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>
      <p className="text-sm text-bordeaux-700 text-pretty mb-3">{review.text}</p>
      <button onClick={onHelpful} className="flex items-center gap-1 text-xs text-bordeaux-500 hover:text-bordeaux-700 transition-colors">
        <ThumbsUp className="w-3.5 h-3.5" /> {t("detail.helpful")} ({review.helpful})
      </button>
    </div>
  );
}
