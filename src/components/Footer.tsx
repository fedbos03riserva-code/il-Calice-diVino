import { Wine } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Footer() {
  const { t } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bordeaux-950 text-cream-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Wine className="w-6 h-6 text-gold-400" />
            <span className="font-serif text-lg font-semibold text-cream-50">
              B<span className="text-gold-400">&amp;</span>F <span className="text-gold-400">45</span>
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Link to="/about" className="text-sm text-cream-300 hover:text-gold-400 transition-colors">Chi siamo</Link>
            <span className="text-cream-500 hidden md:inline">·</span>
            <Link to="/b2b" className="text-sm text-cream-300 hover:text-gold-400 transition-colors">Per ristoratori</Link>
            <span className="text-cream-500 hidden md:inline">·</span>
            <Link to="/premium" className="text-sm text-cream-300 hover:text-gold-400 transition-colors">Premium</Link>
            <span className="text-cream-500 hidden md:inline">·</span>
            <Link to="/admin" className="text-sm text-cream-300 hover:text-gold-400 transition-colors">Admin</Link>
          </div>
          <p className="text-xs text-cream-400">
            &copy; {year} B&F 45. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
