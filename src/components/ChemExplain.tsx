import { useState } from "react";
import { Atom, X, Loader2, FlaskConical } from "lucide-react";

export interface ChemInfo {
  nome: string;
  cosa_e: string;
  cosa_serve: string;
  dove_si_trova: string;
  effetto_in_bocca: string;
}

interface Props {
  compound: string;
  lang?: string;
  children?: React.ReactNode;
}

export function ChemExplainButton({ compound, lang = "it", children }: Props) {
  const [info, setInfo] = useState<ChemInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleExplain = async () => {
    setOpen(true);
    if (info) return;
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chem-explain`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ compound, lang }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Errore");
      }
      const data = await response.json();
      setInfo(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleExplain}
        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-bordeaux-100 text-bordeaux-700 hover:bg-bordeaux-200 transition-colors cursor-pointer"
        title={`Spiega: ${compound}`}
      >
        <Atom className="w-3 h-3" />
        {children || compound}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-bordeaux-950/60 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-cream-50 rounded-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-bordeaux-950 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-bordeaux-600" />
                {compound}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-cream-200"
              >
                <X className="w-5 h-5 text-bordeaux-600" />
              </button>
            </div>

            {loading && (
              <div className="flex items-center gap-3 py-8 justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-bordeaux-600" />
                <p className="text-sm text-bordeaux-600">L'AI analizza il composto...</p>
              </div>
            )}

            {error && !loading && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {info && !loading && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-bordeaux-700 uppercase tracking-wider mb-1">Cos'è</p>
                  <p className="text-sm text-bordeaux-600 leading-relaxed">{info.cosa_e}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-bordeaux-700 uppercase tracking-wider mb-1">A cosa serve</p>
                  <p className="text-sm text-bordeaux-600 leading-relaxed">{info.cosa_serve}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-bordeaux-700 uppercase tracking-wider mb-1">Dove si trova</p>
                  <p className="text-sm text-bordeaux-600 leading-relaxed">{info.dove_si_trova}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-bordeaux-700 uppercase tracking-wider mb-1">Effetto in bocca</p>
                  <p className="text-sm text-bordeaux-600 leading-relaxed">{info.effetto_in_bocca}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
