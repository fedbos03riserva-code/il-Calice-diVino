import { Link } from "react-router-dom";
import { Database, CreditCard, Check, AlertTriangle, ArrowRight, Settings, KeyRound, FileText, Copy, CheckCircle2 } from "lucide-react";
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> {t("ai.setup.title")}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">Guida Setup: Database, AI e Pagamenti</h1>
          <p className="text-sm text-bordeaux-600 leading-relaxed">
            Tutto quello che serve per attivare database, intelligenza artificiale e pagamenti sulla piattaforma B&F 45.
          </p>
        </div>

        {/* DATABASE SECTION */}
        <div className="mb-8 p-6 rounded-2xl bg-bordeaux-950 text-cream-50">
          <h2 className="font-serif text-xl text-gold-400 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" /> 1. Database (Supabase)
          </h2>
          <p className="text-sm text-cream-200 leading-relaxed mb-4">
            Il database salva recensioni, registrazioni utenti e vini salvati. Senza database, tutto funziona in locale sul browser.
            Una volta attivato, i dati vengono sincronizzati automaticamente.
          </p>
        </div>

        {/* DB Step 1 */}
        <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 mb-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">1</div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Trova il dashboard Supabase</h3>
              <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                Il progetto ha gia un database Supabase configurato. Per gestirlo, vai su
                <strong> supabase.com</strong>, accedi con il tuo account e apri il progetto
                <strong> zznwvjgkecrqufzegmpt</strong>.
              </p>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
                Apri Supabase Dashboard <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* DB Step 2 */}
        <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 mb-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">2</div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Apri il SQL Editor</h3>
              <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                Nel menu a sinistra del dashboard Supabase, clicca su <strong>SQL Editor</strong> e poi su <strong>New query</strong>.
                Questo e lo strumento dove incollerai il codice SQL per creare le tabelle.
              </p>
            </div>
          </div>
        </div>

        {/* DB Step 3 */}
        <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 mb-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">3</div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Copia e incolla il codice SQL</h3>
              <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                Nel progetto trovi un file chiamato <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">supabase-migration.sql</code>.
                Apri il file, copia tutto il contenuto e incollalo nel SQL Editor di Supabase.
                Il codice crea tre tabelle: <strong>wine_reviews</strong> (recensioni), <strong>platform_users</strong> (utenti registrati), e <strong>saved_wines</strong> (vini salvati).
              </p>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">Il file e nella cartella principale del progetto. Se non lo trovi, copia il codice dal box qui sotto.</p>
              </div>
              <div className="mt-3 p-4 rounded-lg bg-bordeaux-950 text-cream-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Codice SQL completo</p>
                  <button onClick={() => copyText("-- Vedi il file supabase-migration.sql nel progetto", "sql")} className="text-cream-400 hover:text-cream-50 transition-colors">
                    {copied === "sql" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-cream-300">Copia il contenuto di supabase-migration.sql e incollalo qui sotto nel SQL Editor di Supabase.</p>
              </div>
            </div>
          </div>
        </div>

        {/* DB Step 4 */}
        <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 mb-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-bordeaux-800 text-cream-50 flex items-center justify-center font-serif text-lg font-bold">4</div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Esegui la query</h3>
              <p className="text-sm text-bordeaux-600 leading-relaxed mb-3">
                Clicca il pulsante <strong>Run</strong> (o premi Ctrl+Enter) nel SQL Editor.
                Se tutto va bene, vedrai un messaggio di conferma "Success". Le tre tabelle sono ora create e attive.
              </p>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-700">Fatto! Da questo momento, recensioni, registrazioni e vini salvati vengono sincronizzati automaticamente con il database.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI SECTION */}
        <div className="mb-8 mt-10 p-6 rounded-2xl bg-bordeaux-950 text-cream-50">
          <h2 className="font-serif text-xl text-gold-400 mb-4 flex items-center gap-2">
            <KeyRound className="w-5 h-5" /> 2. AI (Anthropic Claude)
          </h2>
          <p className="text-sm text-cream-200 leading-relaxed mb-4">
            Le funzioni AI (clima, abbinamenti, export matching) usano Claude di Anthropic.
            Senza la chiave API, il sistema usa regole locali automatiche.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-base text-bordeaux-950 mb-2">Passo 1: Crea account Anthropic</h3>
            <p className="text-sm text-bordeaux-600 mb-3">Vai su console.anthropic.com e crea un account con carta di credito.</p>
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
              Vai su Anthropic <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-base text-bordeaux-950 mb-2">Passo 2: Genera la chiave API</h3>
            <p className="text-sm text-bordeaux-600 mb-2">In Settings {">"} API Keys {">"} Create Key. Copia la chiave (inizia con sk-ant-).</p>
          </div>
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-base text-bordeaux-950 mb-2">Passo 3: Inserisci la chiave su Supabase</h3>
            <p className="text-sm text-bordeaux-600 mb-3">
              Supabase Dashboard {">"} Edge Functions {">"} Secrets {">"} Add secret.
              Nome: <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ANTHROPIC_API_KEY</code>, Valore: la chiave copiata.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-base text-bordeaux-950 mb-2">Passo 4: Codice AI per abbinamenti</h3>
            <p className="text-sm text-bordeaux-600 mb-3">
              Solo per gli abbinamenti AI, serve un codice di accesso. Usa:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => copyText("BF45PROVA", "c1")} className="p-3 rounded-lg bg-gold-50 border border-gold-200 text-left">
                <p className="text-xs font-semibold text-bordeaux-700">Standard</p>
                <p className="text-sm text-bordeaux-950 font-mono font-bold flex items-center gap-1.5 mt-1">BF45PROVA {copied === "c1" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-bordeaux-400" />}</p>
              </button>
              <button onClick={() => copyText("BF45PRO", "c2")} className="p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200 text-left">
                <p className="text-xs font-semibold text-bordeaux-700">PRO</p>
                <p className="text-sm text-bordeaux-950 font-mono font-bold flex items-center gap-1.5 mt-1">BF45PRO {copied === "c2" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-bordeaux-400" />}</p>
              </button>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-cream-50 border border-green-200">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <h3 className="font-serif text-base text-bordeaux-950 mb-1">Fatto!</h3>
                <p className="text-sm text-bordeaux-600 mb-3">Testa l'AI su queste pagine:</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/clima-oltrepo" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors">Clima AI</Link>
                  <Link to="/abbinamenti" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors">Abbinamento AI</Link>
                  <Link to="/ai-matching" className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors">Export Matching</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STRIPE SECTION */}
        <div className="mb-8 mt-10 p-6 rounded-2xl bg-bordeaux-950 text-cream-50">
          <h2 className="font-serif text-xl text-gold-400 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> 3. Pagamenti (Stripe)
          </h2>
          <p className="text-sm text-cream-200 leading-relaxed mb-4">
            Per accettare pagamenti reali sulla piattaforma (checkout, abbonamenti premium), serve collegare Stripe.
            Attualmente il checkout e in modalita demo (pagamento simulato).
          </p>
        </div>

        <div className="space-y-4 mb-10">
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-base text-bordeaux-950 mb-2">Passo 1: Crea un account Stripe</h3>
            <p className="text-sm text-bordeaux-600 mb-3">
              Vai su dashboard.stripe.com e registra un account business. Serve un conto bancario per ricevere i pagamenti.
            </p>
            <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
              Crea account Stripe <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-base text-bordeaux-950 mb-2">Passo 2: Trova la chiave segreta</h3>
            <p className="text-sm text-bordeaux-600 mb-2">
              Nel dashboard Stripe, vai su <strong>Developers</strong> {">"} <strong>API Keys</strong>.
              Copia la <strong>Secret key</strong> (inizia con sk_live_ o sk_test_).
            </p>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Usa la test key (sk_test_) per provare i pagamenti senza addebitare carte reali. Passa alla live key (sk_live_) solo quando sei pronto ad accettare pagamenti reali.</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-base text-bordeaux-950 mb-2">Passo 3: Comunica la chiave</h3>
            <p className="text-sm text-bordeaux-600 mb-3">
              Una volta che hai la chiave segreta di Stripe, scrivimi e la colleghero alla piattaforma.
              Il sistema di pagamento verra configurato in modo sicuro: la chiave resta sul server e non viene mai esposta nel browser.
            </p>
            <div className="p-4 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
              <p className="text-xs text-bordeaux-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-bordeaux-500" />
                Dopo aver configurato Stripe, il checkout passera da "Ordine di prova" a pagamento reale con carta di credito.
              </p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
            <h3 className="font-serif text-base text-bordeaux-950 mb-2">Passo 4: Attiva Bolt Stripe</h3>
            <p className="text-sm text-bordeaux-600 mb-3">
              Per completare la configurazione, visita la pagina di setup di Stripe su Bolt:
            </p>
            <a href="https://bolt.new/setup/stripe" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-bordeaux-950 text-sm font-medium hover:bg-gold-300 transition-colors">
              Configura Stripe su Bolt <ArrowRight className="w-4 h-4" />
            </a>
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
