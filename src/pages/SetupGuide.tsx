import { Link } from "react-router-dom";
import { Database, CreditCard, Check, AlertTriangle, ArrowRight, Settings, Copy, CheckCircle2, Sparkles, FlaskConical, Brain, Cloud, Zap, Shield } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function SetupGuide() {
  const { t } = useApp();
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    try { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> Guida Setup
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">Guida completa: Database, AI e Pagamenti</h1>
          <p className="text-sm text-bordeaux-600 leading-relaxed max-w-2xl">
            Questa guida ti accompagna passo passo nell'attivazione delle tre componenti della piattaforma B&F 45.
            Ogni sezione e indipendente: puoi attivare solo cio che ti serve.
          </p>
        </div>

        {/* Quick overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
            <Database className="w-6 h-6 text-bordeaux-700 mb-2" />
            <p className="text-sm font-semibold text-bordeaux-950">Database</p>
            <p className="text-xs text-bordeaux-500 mt-1">Salva recensioni, utenti e vini salvati su Supabase.</p>
          </div>
          <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
            <Brain className="w-6 h-6 text-bordeaux-700 mb-2" />
            <p className="text-sm font-semibold text-bordeaux-950">AI (Anthropic)</p>
            <p className="text-xs text-bordeaux-500 mt-1">Abbinamenti, clima, matching export con Claude AI.</p>
          </div>
          <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
            <CreditCard className="w-6 h-6 text-bordeaux-700 mb-2" />
            <p className="text-sm font-semibold text-bordeaux-950">Pagamenti (Stripe)</p>
            <p className="text-xs text-bordeaux-500 mt-1">Checkout reale con carte di credito.</p>
          </div>
        </div>

        {/* ===== DATABASE SECTION ===== */}
        <div className="mb-8 p-6 rounded-2xl bg-bordeaux-950 text-cream-50">
          <h2 className="font-serif text-xl text-gold-400 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" /> 1. Database (Supabase)
          </h2>
          <p className="text-sm text-cream-200 leading-relaxed mb-4">
            Il database centrale permette alla piattaforma di salvare in modo permanente: recensioni dei vini,
            account utente, vini salvati nei preferiti, candidature per collaborazioni e dati dinamici delle cantine (QR).
            Senza database attivo, tutte queste funzioni restano limitate alla memoria locale del browser.
          </p>
          <div className="p-3 rounded-lg bg-bordeaux-800/50 flex items-start gap-2">
            <Shield className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p className="text-xs text-cream-300">
              <strong className="text-gold-400">Gia configurato:</strong> il database Supabase e preconfigurato nel progetto.
              Le credenziali sono gia inserite e funzionanti. I passaggi seguenti servono solo se devi creare nuove tabelle.
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">1</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Apri il dashboard Supabase</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Vai su <strong>supabase.com/dashboard</strong>, accedi con il tuo account e apri il progetto della piattaforma.
                  Nel dashboard trovi tutti gli strumenti per gestire tabelle, funzioni e sicurezza del database.
                </p>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
                  Apri Supabase Dashboard <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">2</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Crea le tabelle con SQL</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Nel menu a sinistra, clicca <strong>SQL Editor</strong> e poi <strong>New query</strong>.
                  Trova il file <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">supabase-migration.sql</code> nella cartella del progetto,
                  copia tutto il contenuto e incollalo nel SQL Editor. Il codice crea le tabelle per recensioni,
                  utenti, vini salvati, candidature, codici AI e dati QR delle cantine, con tutte le policy di sicurezza.
                </p>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700">Clicca <strong>Run</strong> (o Ctrl+Enter) per eseguire. Se vedi "Success", le tabelle sono attive.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">3</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Verifica le tabelle</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Nel menu a sinistra, clicca <strong>Table Editor</strong>. Dovresti vedere le tabelle create:
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded mx-1">wine_reviews</code>,
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded mx-1">platform_users</code>,
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded mx-1">saved_wines</code>,
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded mx-1">work_with_us</code>,
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded mx-1">ai_access_codes</code>,
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded mx-1">winery_qr_data</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== AI SECTION ===== */}
        <div className="mb-8 mt-12 p-6 rounded-2xl bg-bordeaux-950 text-cream-50">
          <h2 className="font-serif text-xl text-gold-400 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" /> 2. Intelligenza Artificiale (Anthropic Claude)
          </h2>
          <p className="text-sm text-cream-200 leading-relaxed mb-4">
            La piattaforma usa Claude AI di Anthropic per quattro funzioni: abbinamento piatto-vino,
            analisi climatica dell'Oltrepò Pavese, matching export buyer-cantine e discorso del sommelier.
            Ognuna di queste ha un <strong className="text-gold-400">motore locale</strong> di fallback che funziona senza AI.
          </p>

          {/* Engine comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="p-4 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-4 h-4 text-cream-300" />
                <p className="text-xs font-semibold text-cream-100">Motore locale</p>
              </div>
              <ul className="text-xs text-cream-300 space-y-1">
                <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> Sempre disponibile, senza codice</li>
                <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> Risultato istantaneo</li>
                <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> Algoritmo deterministico IRC</li>
                <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> Nessun costo</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <p className="text-xs font-semibold text-gold-400">AI (Anthropic Claude)</p>
              </div>
              <ul className="text-xs text-cream-300 space-y-1">
                <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> Analisi semantica e contestuale</li>
                <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> Sintesi narrative personalizzate</li>
                <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> Comprende sfumature e sinonimi</li>
                <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> Richiede chiave API Anthropic</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-bordeaux-800/50 flex items-start gap-2">
            <Zap className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p className="text-xs text-cream-300">
              Su ogni pagina che usa AI, trovi un toggle <strong className="text-gold-400">"Motore locale / AI"</strong>:
              puoi scegliere volta per volta quale motore usare.
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">1</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Crea un account Anthropic</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Vai su <strong>console.anthropic.com</strong> e crea un account.
                  Serve una carta di credito per l'API, ma il costo per uso della piattaforma e molto basso
                  (pochi centesimi a richiesta). Il modello usato e Claude 3.5 Haiku per le funzioni standard
                  e Claude Sonnet per la modalita PRO.
                </p>
                <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
                  Vai su console.anthropic.com <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">2</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Genera la chiave API</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Nel dashboard Anthropic: <strong>Settings</strong> {">"} <strong>API Keys</strong> {">"} <strong>Create Key</strong>.
                  Dai un nome (es. "BF45 Wine") e copia la chiave che inizia con
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded mx-1">sk-ant-</code>.
                  Non potra essere recuperata in seguito, conservala al sicuro.
                </p>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">La chiave e segreta. Non condividerla con nessuno e non inserirla nel codice dell'app.
                  Va inserita solo come secret su Supabase.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">3</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Inserisci la chiave su Supabase</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-4">
                  Apri il dashboard Supabase: <strong>Edge Functions</strong> {">"} <strong>Secrets</strong> {">"} <strong>Add secret</strong>.
                  Crea un secret con questi valori:
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
                  Verifica anche che <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">SUPABASE_URL</code> e
                  <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded mx-1">SUPABASE_SERVICE_ROLE_KEY</code>
                  siano presenti nei Secrets (di solito preconfigurate).
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">4</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Codice di accesso per abbinamenti AI</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Solo per gli <strong>abbinamenti AI</strong> (non per clima o matching export) serve un codice di accesso.
                  Inseriscilo una sola volta: viene salvato automaticamente.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => copyText("BF45PROVA", "c1")} className="p-3 rounded-lg bg-gold-50 border border-gold-200 text-left hover:border-gold-300 transition-colors">
                    <p className="text-xs font-semibold text-bordeaux-700">Codice standard</p>
                    <p className="text-sm text-bordeaux-950 font-mono font-bold flex items-center gap-1.5 mt-1">
                      BF45PROVA {copied === "c1" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-bordeaux-400" />}
                    </p>
                    <p className="text-xs text-bordeaux-500 mt-1">50 usi al giorno</p>
                  </button>
                  <button onClick={() => copyText("BF45PRO", "c2")} className="p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200 text-left hover:border-bordeaux-300 transition-colors">
                    <p className="text-xs font-semibold text-bordeaux-700">Codice PRO</p>
                    <p className="text-sm text-bordeaux-950 font-mono font-bold flex items-center gap-1.5 mt-1">
                      BF45PRO {copied === "c2" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-bordeaux-400" />}
                    </p>
                    <p className="text-xs text-bordeaux-500 mt-1">Claude Sonnet, analisi avanzata</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-cream-50 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-green-600 text-cream-50 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Tutto pronto! Testa l'AI</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-4">
                  Dopo aver configurato la chiave, vai su queste pagine e usa il toggle "AI" per attivare il motore AI:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/clima-oltrepo" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5" /> Clima AI
                  </Link>
                  <Link to="/abbinamenti" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Abbinamento AI
                  </Link>
                  <Link to="/ai-matching" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" /> Export Matching
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting AI */}
        <div className="mb-10 p-5 rounded-2xl bg-amber-50 border border-amber-200">
          <h3 className="font-serif text-base text-bordeaux-950 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Risoluzione problemi AI
          </h3>
          <div className="space-y-3 text-xs text-bordeaux-700">
            <div>
              <p className="font-semibold">"Errore di connessione. Riprova."</p>
              <p className="mt-0.5">Il server AI non e raggiungibile. Il sistema usa automaticamente il motore locale come fallback.
              Verifica che le edge functions siano deployate su Supabase.</p>
            </div>
            <div>
              <p className="font-semibold">"AI non ancora configurata"</p>
              <p className="mt-0.5">La chiave ANTHROPIC_API_KEY non e stata trovata nei Secrets di Supabase.
              Segui i passaggi sopra per aggiungerla.</p>
            </div>
            <div>
              <p className="font-semibold">"Codice non valido" o "ACCESS_CODE_REQUIRED"</p>
              <p className="mt-0.5">Solo l'abbinamento AI richiede un codice. Usa BF45PROVA per la modalita standard.</p>
            </div>
            <div>
              <p className="font-semibold">L'AI e lenta</p>
              <p className="mt-0.5">E normale: l'AI analizza ogni richiesta individualmente con Claude.
              La modalita PRO usa un modello piu avanzato e impiega qualche secondo in piu.</p>
            </div>
          </div>
        </div>

        {/* ===== STRIPE SECTION ===== */}
        <div className="mb-8 mt-12 p-6 rounded-2xl bg-bordeaux-950 text-cream-50">
          <h2 className="font-serif text-xl text-gold-400 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> 3. Pagamenti (Stripe)
          </h2>
          <p className="text-sm text-cream-200 leading-relaxed mb-4">
            Per accettare pagamenti reali con carta di credito sulla piattaforma (checkout del catalogo vini,
            abbonamenti premium, servizi B2B), serve collegare un account Stripe business.
            Attualmente il checkout funziona in modalita demo (pagamento simulato, nessun addebito reale).
          </p>
          <div className="p-3 rounded-lg bg-bordeaux-800/50 flex items-start gap-2">
            <Shield className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p className="text-xs text-cream-300">
              <strong className="text-gold-400">Sicurezza:</strong> la chiave segreta di Stripe resta sul server e non viene mai esposta nel browser.
              Stripe gestisce tutti i dati delle carte in conformita PCI-DSS.
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">1</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Crea un account Stripe business</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Vai su <strong>dashboard.stripe.com/register</strong> e registra un account business.
                  Serve un conto bancario per ricevere i pagamenti e informazioni sulla tua attivita.
                  L'attivazione richiede verifica dell'identita e puo richiedere qualche giorno.
                </p>
                <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
                  Crea account Stripe <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">2</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Trova le chiavi API</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Nel dashboard Stripe: <strong>Developers</strong> {">"} <strong>API Keys</strong>.
                  Trovi due chiavi: <strong>Publishable key</strong> (pk_, pubblica, va nel browser)
                  e <strong>Secret key</strong> (sk_, segreta, resta sul server).
                </p>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Usa la <strong>test key</strong> (sk_test_) per provare i pagamenti senza addebitare carte reali.
                    Passa alla <strong>live key</strong> (sk_live_) solo quando sei pronto ad accettare pagamenti reali.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">3</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Comunica le chiavi</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Una volta che hai le chiavi di Stripe, scrivimi e le colleghero alla piattaforma in modo sicuro.
                  Il sistema verra configurato per:
                </p>
                <div className="space-y-2 text-xs text-bordeaux-700">
                  <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> Checkout con carta di credito reale</p>
                  <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> Gestione ordini e rimborsi</p>
                  <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> Abbonamenti premium ricorrenti</p>
                  <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> Webhook per sincronizzazione ordini</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gold-500 text-bordeaux-950 flex items-center justify-center font-serif text-lg font-bold">4</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Completa la configurazione su Bolt</h3>
                <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                  Per collegare Stripe alla piattaforma, visita la pagina di setup di Stripe su Bolt:
                </p>
                <a href="https://bolt.new/setup/stripe" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-400 text-bordeaux-950 text-sm font-medium hover:bg-gold-300 transition-colors">
                  Configura Stripe su Bolt <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-xs text-bordeaux-500 mt-3">
                  Dopo la configurazione, il checkout passera da "Ordine di prova" a pagamento reale.
                </p>
              </div>
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
