import { useState } from "react";
import { Brain, Atom, Database, Zap, ChevronDown, ChevronUp, FlaskConical, Globe2, Wine, Cpu, ArrowRight } from "lucide-react";

export default function AIEngineDocs() {
  const [openSection, setOpenSection] = useState<string | null>("irc");

  const sections = [
    {
      id: "irc",
      icon: FlaskConical,
      title: "Motore IRC — Abbinamento Cibo-Vino",
      subtitle: "Scoring chimico-molecolare a 4 dimensioni",
      content: (
        <div className="space-y-5 text-sm text-bordeaux-700 leading-relaxed">
          <p>
            Il motore IRC (Intelligent Recipe Chemistry) calcola la compatibilità tra un piatto e ogni vino del catalogo
            assegnando un punteggio da 0 a 100. Il punteggio è la somma di <strong>4 dimensioni indipendenti</strong>,
            ciascuna con un peso specifico:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Chimica", max: "0-40", color: "bg-bordeaux-50 border-bordeaux-200", desc: "Interazioni molecolari primarie: acidità vs grassi, tannini vs proteine, zuccheri residui vs dolcezza del piatto." },
              { label: "Aromatico", max: "0-25", color: "bg-cream-50 border-cream-200", desc: "Corrispondenza tra i composti volatili del vino (esteri, terpeni, pirazine) e gli aromi dominanti del piatto." },
              { label: "Struttura", max: "0-20", color: "bg-gold-50 border-gold-200", desc: "Coerenza tra corpo del vino e intensità del piatto, tenendo conto di grado alcolico e persistenza." },
              { label: "Pulizia", max: "0-15", color: "bg-bordeaux-50 border-bordeaux-200", desc: "Capacità del vino di pulire il palato tra un boccone e l'altro (effetto sgrassante di acidità e bollicine)." },
            ].map((dim) => (
              <div key={dim.label} className={`p-4 rounded-xl border ${dim.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <strong className="font-serif text-base text-bordeaux-950">{dim.label}</strong>
                  <span className="text-xs font-mono text-bordeaux-500">{dim.max} pt</span>
                </div>
                <p className="text-xs text-bordeaux-600">{dim.desc}</p>
              </div>
            ))}
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Principi chimici applicati</h4>
          <ul className="space-y-2 text-xs text-bordeaux-600">
            <li className="flex items-start gap-2"><Atom className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
              <span><strong>Emulsione lipidica</strong> — L'acidità del vino (acido tartarico, malico) disgrega le micelle lipidiche dei grassi del piatto, pulendo il palato.</span>
            </li>
            <li className="flex items-start gap-2"><Atom className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
              <span><strong>Tannini-proteine</strong> — I tannini (proantocianidine) si legano alle glicoproteine salivari e alle proteine della carne, ammorbidendo l'astringenza.</span>
            </li>
            <li className="flex items-start gap-2"><Atom className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
              <span><strong>Capsaicina e TRPV1</strong> — L'etanolo amplifica la sensazione di piccantezza; zuccheri residui &gt;5 g/L la attenuano competendo con i recettori.</span>
            </li>
            <li className="flex items-start gap-2"><Atom className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
              <span><strong>Equilibrio acido-acido</strong> — Un piatto acido richiede un vino con acidità pari o superiore, altrimenti il vino risulta piatto.</span>
            </li>
            <li className="flex items-start gap-2"><Atom className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
              <span><strong>Umami</strong> — Alimenti ricchi di glutammato amplificano l'amarezza e l'astringenza nei vini tannici.</span>
            </li>
            <li className="flex items-start gap-2"><Atom className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
              <span><strong>Reazioni di Maillard</strong> — Piatti con crosta bruna (composti di Maillard: pirazine, furani) trovano affinità con vini affinati in legno (toast, vaniglia).</span>
            </li>
            <li className="flex items-start gap-2"><Atom className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
              <span><strong>Dolce-dolce</strong> — Il residuo zuccherino del vino deve essere pari o superiore alla dolcezza del dessert.</span>
            </li>
          </ul>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Flusso di calcolo</h4>
          <div className="flex flex-col gap-2 text-xs">
            {[
              "1. Normalizzazione del piatto (lowercase, match keyword)",
              "2. Per ogni vino del catalogo: calcolo dei 4 sotto-punteggi",
              "3. scoreChimica: match acidità/tannini/zuccheri vs ingredienti del piatto",
              "4. scoreAromatico: match profilo aromatico vs aromi dominanti del piatto",
              "5. scoreStruttura: match corpo/alcol vs intensità del piatto",
              "6. scorePulizia: penalità per abbinamenti sconsigliati, bonus per effetto sgrassante",
              "7. Somma dei 4 punteggi = punteggio IRC totale (0-100)",
              "8. Ordinamento decrescente, top 12 risultati",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-cream-50 border border-cream-200">
                <span className="font-mono text-xs text-gold-600">{step.split(":")[0]}</span>
                <span className="text-bordeaux-600">{step.split(":")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "winery",
      icon: Globe2,
      title: "Motore AI — Matching Cantina-Buyer",
      subtitle: "Abbinamento buyer internazionali con cantine dell'Oltrepò Pavese",
      content: (
        <div className="space-y-5 text-sm text-bordeaux-700 leading-relaxed">
          <p>
            Il motore di matching cantine analizza la richiesta di un buyer estero (tipo vino, volume, mercato target,
            budget, certificazioni, incoterms) e la confronta con il profilo di ogni cantina del catalogo per
            identificare le migliori compatibilità.
          </p>

          <h4 className="font-serif text-base text-bordeaux-950">Criteri di valutazione (pesi)</h4>
          <div className="space-y-2">
            {[
              { label: "Export readiness", weight: "+15 pt base", desc: "Cantina con struttura export attiva" },
              { label: "Corrispondenza denominazione", weight: "+25 pt", desc: "Denominazioni richieste vs denominazioni prodotte" },
              { label: "Corrispondenza tipologia vino", weight: "+15 pt", desc: "Tipo di vino richiesto vs tipologie in produzione" },
              { label: "Mercato target vs paesi serviti", weight: "+20 pt", desc: "Esperienza export nel paese del buyer" },
              { label: "Certificazioni", weight: "+15 pt", desc: "Bio, Vegan, BRC, IFS, ISO 22000" },
              { label: "Capacità produttiva vs volume", weight: "+15 pt / -5 pt", desc: "Capacità adeguata o insufficiente" },
              { label: "Prezzo FOB vs budget", weight: "+10 pt / -5 pt", desc: "Prezzo entro budget o superiore" },
              { label: "Incoterms", weight: "+10 pt", desc: "Incoterm richiesto disponibile" },
              { label: "Team multilingue", weight: "+5 pt bonus", desc: "Team commerciale con 3+ lingue" },
            ].map((c) => (
              <div key={c.label} className="flex items-start justify-between p-3 rounded-lg bg-cream-50 border border-cream-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-bordeaux-950">{c.label}</p>
                  <p className="text-xs text-bordeaux-500 mt-0.5">{c.desc}</p>
                </div>
                <span className="text-xs font-mono text-gold-600 shrink-0 ml-3">{c.weight}</span>
              </div>
            ))}
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Due modalita operative</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
              <Cpu className="w-5 h-5 text-bordeaux-600 mb-2" />
              <strong className="text-sm text-bordeaux-950">Motore locale</strong>
              <p className="text-xs text-bordeaux-500 mt-1">Algoritmo deterministico basato su keyword matching e pesi fissi. Sempre disponibile, senza chiave API.</p>
            </div>
            <div className="p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
              <Brain className="w-5 h-5 text-gold-600 mb-2" />
              <strong className="text-sm text-bordeaux-950">Motore AI (BF45 AI)</strong>
              <p className="text-xs text-bordeaux-500 mt-1">Analisi semantica con modello linguistico: comprende contesto, sinonimi, sfumature. Richiede chiave API e codice di accesso.</p>
            </div>
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Flusso AI</h4>
          <div className="flex flex-col gap-2 text-xs">
            {[
              "1. Buyer inserisce descrizione libera della richiesta",
              "2. Estrazione parametri: tipo, volume, paese, budget, certificazioni",
              "3. Normalizzazione e match con ogni cantina (algoritmo locale)",
              "4. Se AI disponibile: invio richiesta + profili cantine al modello linguistico",
              "5. AI restituisce score, reasons e recommendation per ogni cantina",
              "6. Filtro: solo cantine con score &gt;= 30, top 5 per score decrescente",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-cream-50 border border-cream-200">
                <span className="font-mono text-xs text-gold-600">{step.split(":")[0]}</span>
                <span className="text-bordeaux-600">{step.split(":")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "infra",
      icon: Database,
      title: "Infrastruttura tecnica",
      subtitle: "Edge functions, API key, codici di accesso",
      content: (
        <div className="space-y-5 text-sm text-bordeaux-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-gold-600" />
              <strong className="font-serif text-base text-bordeaux-950">Edge Functions Supabase</strong>
            </div>
            <p className="text-xs text-bordeaux-600">Le funzioni AI girano su Supabase Edge Functions (runtime Deno). Due funzioni deployate:</p>
            <ul className="text-xs text-bordeaux-600 mt-2 space-y-1">
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ai-pairing</code> — abbinamento cibo-vino con analisi molecolare</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ai-winery-match</code> — matching buyer-cantine</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-gold-50 border border-gold-300">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-gold-600" />
              <strong className="font-serif text-base text-bordeaux-950">Chiave API AI</strong>
            </div>
            <p className="text-xs text-bordeaux-600">
              Le edge functions usano <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ANTHROPIC_API_KEY</code> come
              secret di Supabase. Questa chiave <strong>non e ancora configurata</strong> nei secrets del progetto.
              Senza la chiave, il motore AI restituisce errore 503 e l'app ricade sul motore locale.
            </p>
            <div className="mt-3 p-3 rounded-lg bg-cream-50 border border-cream-200">
              <p className="text-xs font-semibold text-bordeaux-800 mb-1">Come configurarla:</p>
              <ol className="text-xs text-bordeaux-600 space-y-1 list-decimal list-inside">
                <li>Dashboard Supabase &rarr; Project Settings &rarr; Edge Functions &rarr; Secrets</li>
                <li>Aggiungere: <code className="text-xs bg-cream-100 px-1 py-0.5 rounded">ANTHROPIC_API_KEY</code> = chiave API Anthropic</li>
                <li>Rideployare le edge functions</li>
              </ol>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
            <div className="flex items-center gap-2 mb-2">
              <Wine className="w-5 h-5 text-bordeaux-600" />
              <strong className="font-serif text-base text-bordeaux-950">Codici di accesso AI</strong>
            </div>
            <p className="text-xs text-bordeaux-600">
              L'accesso al motore AI e controllato da codici monouso memorizzati nella tabella <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ai_access_codes</code>.
              Ogni codice ha un numero massimo di utilizzi e una data di scadenza. I codici vengono validati dalla edge function
              prima di ogni chiamata AI.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-bordeaux-600" />
              <strong className="font-serif text-base text-bordeaux-950">Modello AI</strong>
            </div>
            <p className="text-xs text-bordeaux-600">
              Le edge functions usano <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">claude-haiku-4-5-20251001</code> con
              temperature 0 (risposte deterministiche) e max 3000 token. Il system prompt istruisce il modello a ragionare
              a livello molecolare (non con regole empiriche) e a restituire JSON strutturato tramite tool use.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-bordeaux-950 flex items-center justify-center">
          <Brain className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600">BF45 AI Engine</p>
          <h2 className="font-serif text-2xl text-bordeaux-950">Documentazione tecnica</h2>
        </div>
      </div>

      <p className="text-sm text-bordeaux-600 max-w-2xl">
        Spiegazione tecnica ad alto livello del funzionamento del motore AI di BF45: il sistema IRC per l'abbinamento
        cibo-vino e il motore di matching cantine-buyer per l'export.
      </p>

      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-cream-200 bg-cream-50 overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-bordeaux-50 border border-bordeaux-200 flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-bordeaux-700" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-bordeaux-950">{section.title}</h3>
                  <p className="text-xs text-bordeaux-500">{section.subtitle}</p>
                </div>
              </div>
              {openSection === section.id ? <ChevronUp className="w-5 h-5 text-bordeaux-400" /> : <ChevronDown className="w-5 h-5 text-bordeaux-400" />}
            </button>
            {openSection === section.id && (
              <div className="px-5 pb-5 border-t border-cream-200 pt-4">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
