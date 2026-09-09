import { Wine } from "lucide-react";
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
          <p className="text-sm text-cream-300 text-center">{t("footer.tagline")}</p>
          <p className="text-xs text-cream-400">
            &copy; {year} B&F 45. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
