import { useState } from "react";
import { Brain, Atom, Database, Zap, ChevronDown, ChevronUp, FlaskConical, Globe2, Wine, Cpu, ArrowRight, Crown, MapPin, Activity, Layers, Thermometer, Clock, Beaker } from "lucide-react";

export default function AIEngineDocs() {
  const [openSection, setOpenSection] = useState<string | null>("irc");

  const sections = [
    {
      id: "irc",
      icon: FlaskConical,
      title: "Motore IRC — Abbinamento Cibo-Vino",
      subtitle: "Scoring chimico-molecolare a 4 dimensioni con 15 principi enologici",
      content: (
        <div className="space-y-5 text-sm text-bordeaux-700 leading-relaxed">
          <p>
            Il motore IRC (Intelligent Recipe Chemistry) e il cuore tecnologico di Bwine. Calcola la compatibilita
            tra un piatto e ogni vino del catalogo assegnando un punteggio da 0 a 100. Il punteggio e la somma di
            <strong> 4 dimensioni indipendenti</strong>, ciascuna con un peso specifico derivato dalla ricerca
            enologica e dalla chimica sensoriale:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Chimica", max: "0-40", color: "bg-bordeaux-50 border-bordeaux-200", desc: "Interazioni molecolari primarie: acido tartarico vs trigliceridi, procianidine vs glicoproteine salivari, zuccheri residui vs recettori T1R2/T1R3, CO2 vs untuosit\u00e0. Pesi: acidita-grassi +15, tannini-proteine +15, zuccheri-dolcezza +10." },
              { label: "Aromatico", max: "0-25", color: "bg-cream-50 border-cream-200", desc: "Corrispondenza tra composti volatili del vino (linalolo, geraniolo, etil-butirrato, vanillina, geosmina) e aromi dominanti del piatto. Pesi: risonanza terpenica +13, risonanza Maillard +12." },
              { label: "Struttura", max: "0-20", color: "bg-gold-50 border-gold-200", desc: "Coerenza corpo-alcol-intensita. Pesi: corpo-intensita +12, alcol-temperatura +8. Considera glicerina (5-12 g/L), estratto secco (20-30 g/L), grado alcolico." },
              { label: "Pulizia", max: "0-15", color: "bg-bordeaux-50 border-bordeaux-200", desc: "Capacita di pulire il palato tra bocconi. Pesi: acidita/CO2 su grassi +7, tannini su proteine +5, amaro-su-dolce +3. Considera pH (3.0-3.6) e pressione CO2 (bar)." },
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

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">15 Principi chimico-enologici applicati</h4>
          <p className="text-xs text-bordeaux-500">Il motore ragiona a livello molecolare, mai con regole empiriche. Ogni principio cita composti chimici per nome esatto.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { title: "Emulsione lipidica", desc: "Acido tartarico (4-7 g/L) e malico (1-3 g/L) disgregano le micelle lipidiche via solubilizzazione dei trigliceridi. L'etanolo (12-15%) coadiuva sciogliendo grassi non polari." },
              { title: "Tannini-proteine", desc: "Procianidine B1-B4 e polimeri >5000 Da precipitano le glicoproteine salivari (PRPs, mucine MG2). Su proteine cotte (mioglobina denaturata) l'effetto e ammorbidito per competizione." },
              { title: "Capsaicina e TRPV1", desc: "Etanolo amplifica piccantezza solubilizzando capsaicina lipidica. Zuccheri residui >5 g/L attenuano via competizione recettoriale con TRPV1. Bassa gradazione (<12%) riduce l'amplificazione." },
              { title: "Equilibrio acido-acido", desc: "Piatto acido (pH<4.5) richiede vino con acidita pari o superiore (tartarico 4-7 g/L, pH 3.0-3.4). Piatto poco acido tollera vino morbido." },
              { title: "Umami", desc: "Alimenti ricchi di glutammato (>50 mg/100g: pomodori maturi, formaggi stagionati, funghi porcini, salsa di soia) amplificano amaro e astringenza nei vini tannici del 30-50%." },
              { title: "Mineralita e componente iodica", desc: "Pesce con composti solforati (TMA, dimetil-solfito, metantiolo) si abbina a vini minerali (suoli calcarei, gessosi) per complementarita ionica." },
              { title: "Reazioni di Maillard", desc: "Piatti con crosta bruna (furfurale, HMF, pirazine, aldeidi di Strecker) trovano affinita con vini affinati in legno (vanillina, eugenolo, guaiacolo, furfurale della tostatura)." },
              { title: "Dolce-dolce", desc: "Residuo zuccherino del vino deve essere pari o superiore al dessert (regola del +10 g/L). Zuccheri competono a livello recettoriale T1R2/T1R3." },
              { title: "Spezie e composti terpenici", desc: "Spezie aromatiche (cuminaldeide, eugenolo, anetolo, cinammaldeide) trovano corrispondenza in vini terpenici (linalolo, geraniolo, nerolo, citronellolo) via risonanza olfattiva." },
              { title: "CO2 e palato", desc: "Anidride carbonica (4-6 bar in spumanti) pulisce il palato da grassi via rilascio gassoso e stimolazione meccanica dei recettori trigeminali. Aumenta anche la percezione di freschezza acidula." },
              { title: "Temperatura e volatilita", desc: "La temperatura di servizio influenza la volatilita dei composti aromatici (costante di Henry). Piatto caldo (60-70 C) richiede vino a temperatura coerente (14-18 C per rossi)." },
              { title: "Alcol e dolcezza", desc: "Etanolo >14% conferisce calore e struttura ma amplifica piccantezza e amaro. Etanolo 11-13% e fresco e bevibile. Glicerina (5-12 g/L) conferisce rotondita e morbidezza." },
              { title: "Acidita e salivazione", desc: "Acidita alta (pH 3.0-3.2) stimola la salivazione parotidea, pulendo il palato. Acidita bassa (pH 3.6+) risulta piatta su piatti grassi." },
              { title: "Corpo e intensita", desc: "Corpo pieno (alcol 14%+, glicerina 10 g+, estratto 30 g+) regge piatti intensi. Corpo leggero (alcol 11-12%, estratto 20 g+) si perde su piatti strutturati." },
              { title: "Astringenza e succulenza", desc: "Tannini asciugano il palato. Piatti succulenti (brasato, stufato) compensano l'astringenza con il loro liquido di cottura. Piatti asciutti amplificano la sensazione astringente." },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-lg bg-cream-50 border border-cream-200">
                <p className="text-xs font-semibold text-bordeaux-950 flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5 text-gold-600 shrink-0" /> {p.title}
                </p>
                <p className="text-xs text-bordeaux-600 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Discorso narrativo "Perche del vino"</h4>
          <div className="p-4 rounded-xl bg-gradient-to-br from-bordeaux-50 to-gold-50 border border-gold-200">
            <p className="text-xs text-bordeaux-700">
              Per ogni abbinamento, il motore genera un <strong>discorso di 4-5 righe</strong> che spiega in profondita
              perche il vino funziona con il piatto, coprendo 5 dimensioni:
            </p>
            <ol className="text-xs text-bordeaux-600 mt-2 space-y-1 list-decimal list-inside">
              <li><strong>Chimica</strong>: quali reazioni avvengono (tannini-proteine, acidita-grassi, zuccheri-dolcezza)</li>
              <li><strong>Pulizia</strong>: come e perche il vino pulisce il palato tra un boccone e l'altro</li>
              <li><strong>Abbinamenti aromatici</strong>: quali composti volatili del vino risonano con quelli del piatto</li>
              <li><strong>Struttura</strong>: perche il corpo e l'alcol del vino reggono o bilanciano il piatto</li>
              <li><strong>In bocca</strong>: cosa accade chimicamente quando il vino incontra il cibo masticato</li>
            </ol>
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Digestione e abbinamento</h4>
          <div className="p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <p className="text-xs text-bordeaux-700">
              Il motore considera anche l'<strong>impatto digestivo</strong> dell'abbinamento:
            </p>
            <ul className="text-xs text-bordeaux-600 mt-2 space-y-1.5">
              <li className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                <span><strong>Acidita e digestione</strong> — L'acido tartarico e malico del vino stimola la secrezione gastrica (acido cloridrico) e biliare, facilitando la digestione dei grassi e delle proteine. Un vino troppo acido su un piatto grasso puo causare reflusso; troppo morbido non aiuta la digestione.</span>
              </li>
              <li className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                <span><strong>Tannini e proteine</strong> — I tannini legano le proteine alimentari nello stomaco rallentando la digestione. Su carni rosse e formaggi stagionati questo e benefico (digestione lenta ma completa); su pesce o verdure puo causare pesantezza.</span>
              </li>
              <li className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                <span><strong>CO2 e sazieta</strong> — Le bollicine stimolano i recettori di sazieta nello stomaco (recettori meccanici gastrici). Gli spumanti accompagnano bene piatti grassi perche puliscono e non appesantiscono la digestione.</span>
              </li>
              <li className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                <span><strong>Etanolo e assorbimento</strong> — L'alcol aumenta la solubilita dei composti liposolubili (vitamine A, D, E, K) migliorandone l'assorbimento. Tuttavia, etanolo &gt;15% su piatti piccanti amplifica l'irritazione gastrica.</span>
              </li>
              <li className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                <span><strong>Zuccheri residui</strong> — Vini dolci o abboccati (residuo &gt;10 g/L) su piatti salati bilanciano la sapidita e facilitano la digestione dei carboidrati. Su piatti acidi, invece, gli zuccheri mascherano l'acidita e creano disarmonia digestiva.</span>
              </li>
            </ul>
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Flusso di calcolo</h4>
          <div className="flex flex-col gap-2 text-xs">
            {[
              "1. Normalizzazione del piatto (lowercase, match keyword, identificazione ingredienti)",
              "2. Per ogni vino del catalogo: calcolo dei 4 sotto-punteggi IRC",
              "3. scoreChimica: match acidita/tannini/zuccheri vs ingredienti del piatto (15 principi)",
              "4. scoreAromatico: match profilo aromatico (terpeni, esteri, pirazine) vs aromi dominanti",
              "5. scoreStruttura: match corpo/alcol/glicerina vs intensita del piatto",
              "6. scorePulizia: penalita per abbinamenti sconsigliati, bonus per effetto sgrassante",
              "7. Generazione meccanismo chimico, sensazione in bocca, perche del vino, chimica in bocca",
              "8. Generazione molecole protagoniste (4-8 composti per nome chimico)",
              "9. Calcolo temperatura di servizio e tempo di decantazione",
              "10. Somma dei 4 punteggi = punteggio IRC totale (0-100)",
              "11. Ordinamento decrescente, top 12 risultati",
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
      id: "pro",
      icon: Crown,
      title: "Modalita PRO — Analisi Molecolare Avanzata",
      subtitle: "Modello Sonnet, discorsi narrativi, temperatura e decantazione",
      content: (
        <div className="space-y-5 text-sm text-bordeaux-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-gradient-to-br from-bordeaux-950 to-bordeaux-800 text-cream-100">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-gold-400" />
              <strong className="font-serif text-base text-gold-400">Differenze tra modalita Base e PRO</strong>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-bordeaux-900/50 border border-bordeaux-700">
                <p className="text-xs font-semibold text-gold-400 mb-2">Modalita Base</p>
                <ul className="text-xs text-cream-200 space-y-1">
                  <li>Modello: Claude 3.5 Haiku</li>
                  <li>Token: 4.000 max</li>
                  <li>Analisi: 7 principi chimici</li>
                  <li>Discorso perche: 2-3 frasi</li>
                  <li>Tempo minimo: 2.5 secondi</li>
                  <li>Molecole: 3-6 composti</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-gold-400/10 border border-gold-400/30">
                <p className="text-xs font-semibold text-gold-400 mb-2">Modalita PRO</p>
                <ul className="text-xs text-cream-200 space-y-1">
                  <li>Modello: Claude Sonnet 4</li>
                  <li>Token: 6.000 max</li>
                  <li>Analisi: 15 principi chimici + digestione</li>
                  <li>Discorso perche: 4-5 righe narrative</li>
                  <li>Tempo minimo: 4 secondi</li>
                  <li>Molecole: 4-8 composti + temperatura + decantazione</li>
                </ul>
              </div>
            </div>
          </div>

          <h4 className="font-serif text-base text-bordeaux-950">Campi aggiuntivi in modalita PRO</h4>
          <div className="space-y-2">
            {[
              { icon: Crown, label: "perche_del_vino", desc: "Discorso narrativo di 4-5 righe che spiega in profondita perche il vino si abbina al piatto. Copre chimica, pulizia, abbinamenti aromatici, struttura e cosa accade in bocca. Scritto come un maestro sommelier con dottorato in chimica enologica." },
              { icon: Atom, label: "chimica_in_bocca", desc: "Descrive cosa accade chimicamente quando il vino incontra il cibo masticato: precipitazioni tannini-proteine, solubilizzazione dei grassi, rilascio di composti volatili retronasali." },
              { icon: Beaker, label: "molecole_protagoniste", desc: "Array di 4-8 composti chimici specifici coinvolti nell'abbinamento, per nome esatto (acido tartarico, procianidine B1-B4, linalolo, geosmina, etil-butirrato, ecc.)." },
              { icon: Thermometer, label: "temperatura_servizio", desc: "Calcolo della temperatura ottimale di servizio basata su volatilita dei composti, struttura del vino e temperatura del piatto (es. 16-18 C per rossi strutturati, 6-8 C per spumanti)." },
              { icon: Clock, label: "tempo_decantazione", desc: "Minuti di decantazione consigliati basati sul livello di tannini e sul peso molecolare dei polimeri (es. 60-90 min per tannini titanici, non necessario per vini leggeri)." },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3 p-3 rounded-lg bg-cream-50 border border-cream-200">
                <f.icon className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-bordeaux-950 font-mono">{f.label}</p>
                  <p className="text-xs text-bordeaux-600 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Scoring IRC avanzato in PRO</h4>
          <div className="p-4 rounded-xl bg-gold-50 border border-gold-300">
            <p className="text-xs text-bordeaux-700">In modalita PRO, ogni sotto-punteggio e calcolato con precisione granulare:</p>
            <ul className="text-xs text-bordeaux-600 mt-2 space-y-1">
              <li><strong>Chimica (0-40)</strong>: +15 acidita-grassi, +15 tannini-proteine, +10 zuccheri-dolcezza</li>
              <li><strong>Aromatico (0-25)</strong>: +13 risonanza terpenica, +12 risonanza Maillard</li>
              <li><strong>Struttura (0-20)</strong>: +12 corpo-intensita, +8 alcol-temperatura</li>
              <li><strong>Pulizia (0-15)</strong>: +7 acidita/CO2 su grassi, +5 tannini su proteine, +3 amaro-su-dolce</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "geo",
      icon: MapPin,
      title: "GeoMapping e Tecnologie Informatiche",
      subtitle: "Mappa satellitare, terroir, matching geografico",
      content: (
        <div className="space-y-5 text-sm text-bordeaux-700 leading-relaxed">
          <p>
            Bwine integra tecnologie di geolocalizzazione e mappatura satellitare per collegare ogni vino al proprio
            terroir di origine e abbinare geograficamente buyer e cantine.
          </p>

          <h4 className="font-serif text-base text-bordeaux-950">Stack tecnologico GeoMapping</h4>
          <div className="space-y-2">
            {[
              { icon: Globe2, title: "Esri World Imagery", desc: "Layer satellitare ad alta risoluzione per la visualizzazione dei vigneti dell'Oltrepo Pavese. Integrato via Leaflet come tile layer WMS." },
              { icon: MapPin, title: "OpenStreetMap", desc: "Layer vettoriale di base con strade, confini comunali, punti di interesse. Overlay trasparente sulla mappa satellitare per navigazione." },
              { icon: MapPin, title: "Leaflet.js", desc: "Libreria JavaScript open-source per mappe interattive. Supporta zoom, pan, popup, marker personalizzati per ogni cantina con coordinate GPS reali." },
              { icon: Layers, title: "GeoJSON Oltrepo Pavese", desc: "Confini territoriali in formato GeoJSON per evidenziare le 4 zone DOC (Oltrepo Pavese DOC, Sangue di Giuda, Buttafuoco, Bonarda) con poligoni colorati." },
              { icon: Activity, title: "Matching geografico export", desc: "Il motore di matching cantine-buyer calcola la distanza geografica tra il buyer e ogni cantina, considerando logistica e incoterms. Le cantine piu vicine ai porti di imbarco ricevono bonus nel punteggio." },
            ].map((t) => (
              <div key={t.title} className="flex items-start gap-3 p-3 rounded-lg bg-cream-50 border border-cream-200">
                <t.icon className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-bordeaux-950">{t.title}</p>
                  <p className="text-xs text-bordeaux-600 mt-0.5">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Tecnologie informatiche del motore</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: Cpu, title: "Motore locale (TypeScript)", desc: "Algoritmo deterministico in TypeScript puro. Sempre disponibile, senza chiave API. Calcola 4 sotto-punteggi IRC per ogni vino in meno di 50ms. Genera meccanismo chimico, sensazione in bocca, perche del vino, molecole protagoniste, temperatura e decantazione." },
              { icon: Brain, title: "Motore AI (Edge Function)", desc: "Supabase Edge Function (runtime Deno) che chiama l'API Anthropic. System prompt con 15 principi chimici, tool use per output JSON strutturato. Temperature 0 per risposte deterministiche. Rate limiting 10 richieste/minuto per IP." },
              { icon: Database, title: "Supabase Postgres", desc: "Database PostgreSQL gestito. Tabelle: ai_access_codes (codici monouso), winery_qr_data (dati dinamici QR), work_with_us (candidature), rfq (richieste export). RLS attivo su ogni tabella." },
              { icon: Zap, title: "Catalogo intelligente", desc: "Campionamento del catalogo: prioritizza i tipi di vino coerenti con il piatto (60% slot), riempie il resto con quota equa tra tipi. Massimo 60 vini inviati all'AI per ottimizzare token e latenza." },
            ].map((t) => (
              <div key={t.title} className="p-4 rounded-xl bg-cream-50 border border-cream-200">
                <t.icon className="w-5 h-5 text-bordeaux-600 mb-2" />
                <p className="text-xs font-semibold text-bordeaux-950">{t.title}</p>
                <p className="text-xs text-bordeaux-600 mt-1">{t.desc}</p>
              </div>
            ))}
          </div>

          <h4 className="font-serif text-base text-bordeaux-950 mt-4">Sicurezza e accesso</h4>
          <div className="p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <ul className="text-xs text-bordeaux-600 space-y-1.5">
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> Rate limiting in-memory: 10 richieste/minuto per IP</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> Sanitizzazione input: rimozione caratteri di controllo, troncamento lunghezza</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> Codici di accesso monouso con limite utilizzi e scadenza (tabella ai_access_codes)</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> CORS headers su ogni risposta (preflight, success, error)</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> RLS attivo su tutte le tabelle del database</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> Limite body: 200 KB per richiesta</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "winery",
      icon: Globe2,
      title: "Motore AI — Matching Cantina-Buyer",
      subtitle: "Abbinamento buyer internazionali con cantine dell'Oltrepo Pavese",
      content: (
        <div className="space-y-5 text-sm text-bordeaux-700 leading-relaxed">
          <p>
            Il motore di matching cantine analizza la richiesta di un buyer estero (tipo vino, volume, mercato target,
            budget, certificazioni, incoterms) e la confronta con il profilo di ogni cantina del catalogo per
            identificare le migliori compatibilita.
          </p>

          <h4 className="font-serif text-base text-bordeaux-950">Criteri di valutazione (pesi)</h4>
          <div className="space-y-2">
            {[
              { label: "Export readiness", weight: "+15 pt base", desc: "Cantina con struttura export attiva" },
              { label: "Corrispondenza denominazione", weight: "+25 pt", desc: "Denominazioni richieste vs denominazioni prodotte" },
              { label: "Corrispondenza tipologia vino", weight: "+15 pt", desc: "Tipo di vino richiesto vs tipologie in produzione" },
              { label: "Mercato target vs paesi serviti", weight: "+20 pt", desc: "Esperienza export nel paese del buyer" },
              { label: "Certificazioni", weight: "+15 pt", desc: "Bio, Vegan, BRC, IFS, ISO 22000" },
              { label: "Capacita produttiva vs volume", weight: "+15 pt / -5 pt", desc: "Capacita adeguata o insufficiente" },
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
              "6. Filtro: solo cantine con score >= 30, top 5 per score decrescente",
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
      subtitle: "Edge functions, modelli AI, codici di accesso",
      content: (
        <div className="space-y-5 text-sm text-bordeaux-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-gold-600" />
              <strong className="font-serif text-base text-bordeaux-950">Edge Functions Supabase</strong>
            </div>
            <p className="text-xs text-bordeaux-600">Le funzioni AI girano su Supabase Edge Functions (runtime Deno). Tre funzioni deployate:</p>
            <ul className="text-xs text-bordeaux-600 mt-2 space-y-1">
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ai-pairing</code> — abbinamento cibo-vino con analisi molecolare (modalita Base + PRO)</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ai-winery-match</code> — matching buyer-cantine per export</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" /> <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">analytics-stats</code> — statistiche aggregate per dashboard</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-gold-50 border border-gold-300">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-gold-600" />
              <strong className="font-serif text-base text-bordeaux-950">Modelli AI</strong>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-cream-50 border border-cream-200">
                <p className="text-xs font-semibold text-bordeaux-950">Modalita Base</p>
                <p className="text-xs text-bordeaux-600 mt-1"><code className="text-xs bg-cream-100 px-1 py-0.5 rounded">claude-3-5-haiku-20241022</code> — Veloce, economico, 4.000 token. Analisi con 15 principi chimici.</p>
              </div>
              <div className="p-3 rounded-lg bg-cream-50 border border-cream-200">
                <p className="text-xs font-semibold text-bordeaux-950">Modalita PRO</p>
                <p className="text-xs text-bordeaux-600 mt-1"><code className="text-xs bg-cream-100 px-1 py-0.5 rounded">claude-sonnet-4-20250514</code> — Potente, 6.000 token. Analisi molecolare avanzata con discorsi narrativi.</p>
              </div>
            </div>
            <p className="text-xs text-bordeaux-600 mt-3">
              La chiave <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ANTHROPIC_API_KEY</code> e
              configurata come secret di Supabase e attiva. Le edge functions la leggono a runtime.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
            <div className="flex items-center gap-2 mb-2">
              <Wine className="w-5 h-5 text-bordeaux-600" />
              <strong className="font-serif text-base text-bordeaux-950">Codici di accesso AI</strong>
            </div>
            <p className="text-xs text-bordeaux-600">
              L'accesso al motore AI e controllato da codici memorizzati nella tabella <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">ai_access_codes</code>.
              Ogni codice ha un numero massimo di utilizzi e una data di scadenza. I codici vengono validati dalla edge function
              prima di ogni chiamata AI, con incremento atomico del contatore utilizzi.
            </p>
            <div className="mt-3 p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
              <p className="text-xs font-semibold text-bordeaux-800 mb-1">Codici attivi nel database:</p>
              <ul className="text-xs text-bordeaux-600 space-y-1">
                <li><code className="text-xs bg-cream-100 px-1 py-0.5 rounded">BF45PROVA</code> — 100 usi max (demo)</li>
                <li><code className="text-xs bg-cream-100 px-1 py-0.5 rounded">BF45PRO</code> — 10.000 usi max (PRO)</li>
                <li><code className="text-xs bg-cream-100 px-1 py-0.5 rounded">BF45TRIAL</code> — 50 usi max (trial)</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-bordeaux-600" />
              <strong className="font-serif text-base text-bordeaux-950">System Prompt</strong>
            </div>
            <p className="text-xs text-bordeaux-600">
              Il system prompt istruisce il modello a ragionare a livello molecolare (non con regole empiriche)
              e a restituire JSON strutturato tramite tool use. Include 15 principi chimico-enologici con
              composti specifici per nome, regole di scoring IRC con pesi granulari, e istruzioni per generare
              il discorso narrativo "perche del vino" di 4-5 righe. In modalita PRO, aggiunge istruzioni per
              temperatura di servizio, tempo di decantazione e analisi molecolare completa.
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
        Spiegazione tecnica ad alto livello del funzionamento del motore AI di Bwine: il sistema IRC per l'abbinamento
        cibo-vino con 15 principi chimico-enologici, la modalita PRO con analisi molecolare avanzata, il GeoMapping
        satellitare e il motore di matching cantine-buyer per l'export.
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
