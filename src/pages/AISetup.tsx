import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Check, AlertTriangle, ArrowRight, Brain, Cloud, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AISetup() {
  const { t } = useApp();
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    try { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> Configurazione
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">Come attivare l'AI</h1>
          <p className="text-sm text-bordeaux-600 leading-relaxed">
            La piattaforma usa Claude AI di Anthropic per analisi climatica, abbinamenti, matching export e spiegazioni chimiche.
            Senza la chiave API, il sistema usa regole automatiche locali — meno precise ma sempre disponibili.
            Segui questi passi per attivare la modalità AI completa.
          </p>
        </div>

        {/* Status overview */}
        <div className="mb-8 p-5 rounded-2xl bg-bordeaux-950 text-cream-50">
          <h2 className="font-serif text-lg text-gold-400 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" /> Funzioni AI che richiedono la chiave
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-gold-400" />
                <div>
                  <p className="text-sm text-cream-50">Analisi Climatica Oltrepò</p>
                  <p className="text-xs text-cream-300">Rischi, adattamenti, proiezioni</p>
                </div>
              </div>
              <Link to="/clima-oltrepo" className="text-xs px-3 py-1.5 rounded-lg bg-bordeaux-700 text-cream-50 hover:bg-bordeaux-600 transition-colors">Vai</Link>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <div>
                  <p className="text-sm text-cream-50">Abbinamento AI (richiede codice)</p>
                  <p className="text-xs text-cream-300">Analisi molecolare piatto-vino</p>
                </div>
              </div>
              <Link to="/abbinamenti" className="text-xs px-3 py-1.5 rounded-lg bg-bordeaux-700 text-cream-50 hover:bg-bordeaux-600 transition-colors">Vai</Link>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-gold-400" />
                <div>
                  <p className="text-sm text-cream-50">AI Export Matching</p>
                  <p className="text-xs text-cream-300">Matching buyer-cantine e analisi export</p>
                </div>
              </div>
              <Link to="/ai-matching" className="text-xs px-3 py-1.5 rounded-lg bg-bordeaux-700 text-cream-50 hover:bg-bordeaux-600 transition-colors">Vai</Link>
            </div>
          </div>
        </div>

        {/* Step-by-step guide */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">1</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Crea un account Anthropic</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Vai sul sito di Anthropic e crea un account. Serve una carta di credito per attivare l'API,
                  ma il costo per uso della piattaforma e molto basso (pochi centesimi a richiesta).
                </p>
                <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
                  Vai su console.anthropic.com <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">2</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Genera la chiave API</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Nel dashboard Anthropic, vai su <strong>Settings</strong> {">"} <strong>API Keys</strong> {">"} <strong>Create Key</strong>.
                  Dai un nome (es. "BF45 Wine") e copia la chiave che inizia con <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">sk-ant-</code>.
                  Non potranno essere recuperate in seguito, conservala al sicuro.
                </p>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">La chiave e segreta. Non condividerla con nessuno e non inserirla nel codice dell'app.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">3</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Inserisci la chiave su Supabase</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-4">
                  Apri il dashboard Supabase del progetto e vai su <strong>Edge Functions</strong> {">"} <strong>Secrets</strong>.
                  Crea un nuovo secret con:
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-bordeaux-950 text-cream-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Nome del secret</p>
                      <button onClick={() => copyText("ANTHROPIC_API_KEY", "name")} className="text-cream-400 hover:text-cream-50 transition-colors">
                        {copied === "name" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <code className="text-sm text-cream-50">ANTHROPIC_API_KEY</code>
                  </div>
                  <div className="p-4 rounded-lg bg-bordeaux-950 text-cream-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Valore del secret</p>
                      <button onClick={() => copyText("sk-ant-api03-...", "val")} className="text-cream-400 hover:text-cream-50 transition-colors">
                        {copied === "val" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <code className="text-sm text-cream-50">sk-ant-api03-la-tua-chiave-qui...</code>
                  </div>
                </div>
                <p className="text-xs text-bordeaux-500 mt-3">
                  Supabase Dashboard {">"} Edge Functions {">"} Secrets {">"} Add secret {">"} Name: ANTHROPIC_API_KEY, Value: la chiave copiata
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">4</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Verifica che le chiavi Supabase siano configurate</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Le edge functions usano anche <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">SUPABASE_URL</code> e
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded ml-1">SUPABASE_SERVICE_ROLE_KEY</code> per
                  leggere i codici di accesso AI. Su Supabase Dashboard {">"} Edge Functions {">"} Secrets, verifica che
                  entrambe siano presenti. Di solito sono gia preconfigurate automaticamente.
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-bordeaux-600 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> SUPABASE_URL — di solito precompilata</p>
                  <p className="text-xs text-bordeaux-600 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> SUPABASE_SERVICE_ROLE_KEY — di solito precompilata</p>
                  <p className="text-xs text-bordeaux-600 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> ANTHROPIC_API_KEY — da aggiungere manualmente</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">5</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Attiva il codice AI per gli abbinamenti</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  L'abbinamento AI richiede anche un codice di accesso. Quando apri la pagina dei risultati,
                  clicca <strong>"Sblocca AI"</strong> e inserisci uno dei codici demo:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gold-50 border border-gold-200">
                    <p className="text-xs font-semibold text-bordeaux-700">Codice demo standard</p>
                    <button onClick={() => copyText("BF45PROVA", "code1")} className="text-sm text-bordeaux-950 font-mono font-bold flex items-center gap-1.5 mt-1">
                      BF45PROVA
                      {copied === "code1" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-bordeaux-400" />}
                    </button>
                    <p className="text-xs text-bordeaux-500 mt-1">50 usi al giorno</p>
                  </div>
                  <div className="p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
                    <p className="text-xs font-semibold text-bordeaux-700">Codice PRO</p>
                    <button onClick={() => copyText("BF45PRO", "code2")} className="text-sm text-bordeaux-950 font-mono font-bold flex items-center gap-1.5 mt-1">
                      BF45PRO
                      {copied === "code2" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-bordeaux-400" />}
                    </button>
                    <p className="text-xs text-bordeaux-500 mt-1">Modalita PRO con Claude Sonnet</p>
                  </div>
                </div>
                <p className="text-xs text-bordeaux-400 mt-3">
                  Il codice va inserito una sola volta — viene salvato e usato automaticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-cream-50 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-green-600 text-cream-50 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Fatto! Testa l'AI</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-4">
                  Dopo aver configurato la chiave, torna su queste pagine e prova:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/clima-oltrepo" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5" /> Testa clima AI
                  </Link>
                  <Link to="/abbinamenti" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Testa abbinamento AI
                  </Link>
                  <Link to="/ai-matching" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" /> Testa export matching
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-8 p-5 rounded-2xl bg-amber-50 border border-amber-200">
          <h3 className="font-serif text-base text-bordeaux-950 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Risoluzione problemi
          </h3>
          <div className="space-y-3 text-xs text-bordeaux-700">
            <div>
              <p className="font-semibold">"Il motore locale ha usato regole automatiche"</p>
              <p className="mt-0.5">L'AI non e configurata. Segui i passaggi sopra per inserire la chiave ANTHROPIC_API_KEY.</p>
            </div>
            <div>
              <p className="font-semibold">"AI non ancora configurata"</p>
              <p className="mt-0.5">La chiave API non e stata trovata. Verifica che il secret sia salvato correttamente su Supabase.</p>
            </div>
            <div>
              <p className="font-semibold">"Codice non valido" o "ACCESS_CODE_REQUIRED"</p>
              <p className="mt-0.5">Solo l'abbinamento AI richiede un codice. Usa BF45PROVA per la modalita standard.</p>
            </div>
            <div>
              <p className="font-semibold">L'AI funziona ma e lenta</p>
              <p className="mt-0.5">E normale — l'AI analizza ogni richiesta individualmente. La modalita PRO usa un modello piu avanzato e impiega qualche secondo in piu.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-bordeaux-600 hover:text-bordeaux-800">
            {t("nav.home")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
