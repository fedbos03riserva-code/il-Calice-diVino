import { useState } from "react";
import { FileText, Download, Loader2, FileDown, Shield, Briefcase, Mail, Brain, BookOpen, Check, Lock } from "lucide-react";
import { jsPDF } from "jspdf";

interface DocDef {
  id: string;
  title: string;
  desc: string;
  icon: typeof FileText;
  color: string;
  generate: (password: string) => void;
}

const BRAND = "B&F 45";
const TAGLINE = "Intelligent Wine Pairing & Curated Cellar";
const ADMIN_PASSWORD = "bf45-admin";

function addFooter(doc: jsPDF, page: number, total: number) {
  const h = doc.internal.pageSize.height;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, h - 15, 190, h - 15);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text(`${BRAND} — ${TAGLINE}`, 105, h - 10, { align: "center" });
  doc.text(`Pagina ${page} di ${total}`, 105, h - 5, { align: "center" });
}

function addSectionTitle(doc: jsPDF, y: number, text: string): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(25, 12, 20);
  doc.text(text, 20, y);
  doc.setDrawColor(200, 157, 46);
  doc.setLineWidth(0.3);
  doc.line(20, y + 2, 190, y + 2);
  return y + 8;
}

function addParagraph(doc: jsPDF, y: number, text: string, indent = 20): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const lines = doc.splitTextToSize(text, 170 - (indent - 20));
  for (const line of lines) {
    if (y > 270) { doc.addPage(); y = 25; }
    doc.text(line, indent, y);
    y += 5.5;
  }
  return y + 3;
}

function addBullet(doc: jsPDF, y: number, text: string, level = 0): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const indent = 25 + level * 8;
  const bullet = level === 0 ? "-" : "\u00B7";
  doc.text(bullet, indent - 3, y);
  const lines = doc.splitTextToSize(text, 190 - indent);
  for (let i = 0; i < lines.length; i++) {
    if (y > 270) { doc.addPage(); y = 25; }
    doc.text(lines[i], indent, y);
    y += 5.5;
  }
  return y + 2;
}

function newPage(doc: jsPDF): number {
  doc.addPage();
  return 25;
}

function generateLineeGuida(password: string) {
  const doc = new jsPDF();
  let y = 55;
  let page = 1;

  y = addSectionTitle(doc, y, "ACCESSO ADMIN");
  y = addParagraph(doc, y, "Come accedere al pannello di controllo:");
  y = addBullet(doc, y, "Vai nel menu \"Altro\" in alto e clicca \"Admin\"");
  y = addBullet(doc, y, "Devi essere loggato con l'account amministratore: federico.bosoni@gmail.com");
  y = addBullet(doc, y, "Inserisci la password admin: bf45-admin");
  y = addBullet(doc, y, "Da li vedi: Panoramica, Ordini, Candidature, Recensioni, Ricerche, Catalogo, QR Cantina, Investitori, AI Engine, AI");
  y += 3;
  y = addParagraph(doc, y, "PER RENDERLO PIU SICURO: Cambia la password admin (attualmente \"bf45-admin\" e visibile nel codice). Per cambiarla: apri src/pages/Admin.tsx, cerca \"bf45-admin\" e sostituisci con la tua nuova password.");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "ACCESSO BUSINESS PLAN");
  y = addParagraph(doc, y, "Il Business Plan e protetto da password. Per accedere:");
  y = addBullet(doc, y, "Vai nel menu \"Altro\" e clicca \"Business Plan\"");
  y = addBullet(doc, y, "Inserisci la password: BF45invest2026");
  y = addBullet(doc, y, "Per cambiarla: apri src/pages/BusinessPlan.tsx, cerca \"BP_PASSWORD\" e sostituisci il valore");

  y += 5;
  y = addSectionTitle(doc, y, "CODICI DI ACCESSO AI MOTORE AI");
  y = addParagraph(doc, y, "Il motore AI di abbinamento molecolare si attiva con codici di accesso. I codici sono salvati nella tabella Supabase \"ai_access_codes\".");
  y = addParagraph(doc, y, "Ogni codice ha: max_uses (limite totale), daily_limit (limite giornaliero, si resetta ogni 24 ore), uses_count (utilizzi totali), daily_uses_count (utilizzi oggi), daily_reset_at (timestamp del reset).");
  y += 2;
  y = addParagraph(doc, y, "CODICI ATTIVI:");
  y = addBullet(doc, y, "BF45PROVA — Codice demo: 100 usi totali, 50/giorno, piano trial");
  y = addBullet(doc, y, "BF45PRO — Codice PRO: 10.000 usi totali, 100/giorno, piano monthly, sblocca modalita PRO (Claude Sonnet 4)");
  y = addBullet(doc, y, "BF45TRIAL — Codice trial: 50 usi totali, 30/giorno, piano trial");
  y += 2;
  y = addParagraph(doc, y, "COME USARE I CODICI:");
  y = addBullet(doc, y, "Vai sulla pagina \"Abbinamenti\" e cerca un piatto");
  y = addBullet(doc, y, "Nei risultati, clicca \"Sblocca AI\" e inserisci il codice");
  y = addBullet(doc, y, "Il codice viene salvato nel browser (localStorage) per le prossime volte");
  y = addBullet(doc, y, "Puoi scegliere tra \"Motore locale\" (sempre gratuito) e \"Motore AI\" (usa il codice)");
  y = addBullet(doc, y, "Con un codice PRO puoi attivare la \"Modalita PRO\" per analisi molecolare avanzata");
  y += 2;
  y = addParagraph(doc, y, "LIMITI GIORNALIERI: Il limite giornaliero si resetta automaticamente 24 ore dopo il primo uso della giornata. Se il limite e raggiunto, l'app usa automaticamente il motore locale. Il contatore giornaliero e nel database, non in memoria, quindi e condiviso tra dispositivi.");
  y += 2;
  y = addParagraph(doc, y, "Come creare nuovi codici: vai su Supabase, apri il Table Editor sulla tabella \"ai_access_codes\", inserisci una nuova riga con code, max_uses, daily_limit, uses_count=0, daily_uses_count=0, active=true, expires_at (opzionale).");
  y = addParagraph(doc, y, "Oppure via SQL: INSERT INTO ai_access_codes (code, plan, max_uses, daily_limit, active) VALUES ('BF45NEW', 50, 20, true);");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "TABELLE DATABASE");
  y = addBullet(doc, y, "rfq_requests — Richieste di preventivo dai buyer esteri alle cantine. Policy: insert anon+authenticated, select/update/delete authenticated");
  y = addBullet(doc, y, "winery_qr_data — Dati dinamici dei QR code delle cantine. Policy: insert anon+authenticated, select/update/delete authenticated");
  y = addBullet(doc, y, "ai_access_codes — Codici di accesso per il motore AI. Campi: code, plan, max_uses, uses_count, daily_limit, daily_uses_count, daily_reset_at, expires_at, active. Policy: insert/select/update/delete anon+authenticated");
  y = addBullet(doc, y, "work_with_us — Candidature dal form \"Lavora con noi\". Policy: insert anon+authenticated, select/update/delete authenticated");

  y += 5;
  y = addSectionTitle(doc, y, "EDGE FUNCTIONS");
  y = addBullet(doc, y, "ai-pairing — Chiama Claude AI (Anthropic) per l'abbinamento molecolare. Rotta: /functions/v1/ai-pairing. Verifica codice + limite totale + limite giornaliero. Modelli: Claude 3.5 Haiku (base), Claude Sonnet 4 (PRO). Rate limiting: 10 req/min per IP");
  y = addBullet(doc, y, "ai-winery-match — Matching buyer-cantine per export con AI. Rotta: /functions/v1/ai-winery-match");
  y = addBullet(doc, y, "analytics-stats — Statistiche anonime per la dashboard. Rotta: /functions/v1/analytics-stats");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "MENU DI NAVIGAZIONE");
  y = addParagraph(doc, y, "Menu Privati: Home, Abbinamenti, Quiz del gusto, Wine Lab, Consigli culinari (Reverse Pairing), BF45 Premium");
  y = addParagraph(doc, y, "Menu Cantina: Oltrepo Pavese (catalogo filtrato), Resto del mondo (catalogo completo)");
  y = addParagraph(doc, y, "Menu Abbinamenti: Abbinamenti, Wine Lab, AI Matching, Consigli culinari, Consulenza privata");
  y = addParagraph(doc, y, "Menu Export: B&F 45 for business, Directory cantine, Mappa cantine, RFQ, Export Process, Materiali B2B");
  y = addParagraph(doc, y, "Menu Ristorante: Dashboard ristorante, Analytics, Menu QR, QR Cantina");
  y = addParagraph(doc, y, "Menu Eventi: Eventi Oltrepo Pavese");
  y = addParagraph(doc, y, "Menu Altro: Chi siamo & Contatti, Lavora con noi, Business Plan (protetto), Admin");

  y += 5;
  y = addSectionTitle(doc, y, "LINGUE SUPPORTATE");
  y = addParagraph(doc, y, "7 lingue: IT, EN, FR, ES, DE, JP, NL. File traduzioni: src/i18n/translations.ts");

  y += 5;
  y = addSectionTitle(doc, y, "MODALITA AI BASE vs PRO");
  y = addParagraph(doc, y, "Modalita Base (Claude 3.5 Haiku): 4000 token max, 15 principi chimico-enologici, discorso perche 2-3 frasi, molecole 3-6 composti, tempo minimo 2.5 secondi");
  y = addParagraph(doc, y, "Modalita PRO (Claude Sonnet 4): 6000 token max, 15 principi chimici + analisi digestiva, discorso perche 4-5 righe narrative, molecole 4-8 composti + temperatura + decantazione, tempo minimo 4 secondi. Richiede codice PRO (BF45PRO)");

  y += 5;
  y = addSectionTitle(doc, y, "STRUTTURA TECNOLOGICA");
  y = addParagraph(doc, y, "Frontend: React + TypeScript + Vite");
  y = addParagraph(doc, y, "Backend: Supabase (PostgreSQL, RLS, Edge Functions Deno)");
  y = addParagraph(doc, y, "AI: Claude (Anthropic) per abbinamento molecolare — Base: claude-3-5-haiku-20241022, PRO: claude-sonnet-4-20250514");
  y = addParagraph(doc, y, "GeoMapping: Leaflet.js + Esri World Imagery + OpenStreetMap");
  y = addParagraph(doc, y, "Stile: Tailwind CSS 4, palette bordeaux/oro/crema. Font: serif per titoli, sans-serif per body");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "USO DELL'AI NEL MATCHING CANTINE-BUYER");
  y = addParagraph(doc, y, "Il matching cantine-buyer abbinia un buyer estero (importatore, distributore, ristorante) alla cantina dell'Oltrepo Pavese piu adatta. Due modalita:");
  y += 2;
  y = addParagraph(doc, y, "1. MOTORE AI (ai-winery-match edge function)");
  y = addParagraph(doc, y, "Modello: Claude Haiku (Anthropic), 3000 token, temperature 0. Il buyer scrive una richiesta in linguaggio naturale (es. \"Cerco un Pinot Nero metodo classico, 5000 bottiglie, per il mercato giapponese, budget medio\"). L'AI legge la richiesta, analizza ogni cantina e assegna un punteggio 0-100 basato su 8 criteri:");
  y = addBullet(doc, y, "Tipologia vino richiesta vs tipologie prodotte dalla cantina");
  y = addBullet(doc, y, "Denominazione richiesta vs denominazioni della cantina");
  y = addBullet(doc, y, "Volume richiesto vs capacita produttiva (1 hl = 133 bottiglie)");
  y = addBullet(doc, y, "Budget vs prezzo FOB della cantina");
  y = addBullet(doc, y, "Mercato target vs paesi gia serviti (esperienza export)");
  y = addBullet(doc, y, "Certificazioni richieste vs certificazioni possedute (Bio, Vegan, BRC, IFS, ISO)");
  y = addBullet(doc, y, "Incoterms richiesti vs incoterms accettati (FOB, CIF, EXW, DDP, DAP)");
  y = addBullet(doc, y, "Lingue del team vs mercato target (es. team che parla giapponese per buyer giapponese)");
  y += 2;
  y = addParagraph(doc, y, "Output per ogni cantina con score >= 30: score (0-100), reasons (motivi positivi e negativi), recommendation (frase di sintesi), sintesi (riepilogo generale).");
  y = addParagraph(doc, y, "Esempi: \"Bonarda bio per Germania, 2000 bottiglie, FOB\" / \"Buttafuoco Storico premium per USA, 1000 bt, certificazione bio\" / \"Moscato dolce per Taiwan, CIF, 3000 bt\"");
  y = addParagraph(doc, y, "Sicurezza: rate limiting 10 req/min per IP, body size limit 100KB, sanificazione input, max 50 cantine per richiesta.");
  y += 2;
  y = addParagraph(doc, y, "2. MOTORE LOCALE (src/lib/wineryMatcher.ts)");
  y = addParagraph(doc, y, "Sempre disponibile, senza codice. Algoritmo deterministico con keyword matching su 9 criteri:");
  y = addBullet(doc, y, "Export readiness (+15 pt)");
  y = addBullet(doc, y, "Denominazione (+25 pt)");
  y = addBullet(doc, y, "Tipologia vino (+15 pt)");
  y = addBullet(doc, y, "Paese/mercato (+20 pt se gia serve, +8 pt se esporta ma nuovo mercato)");
  y = addBullet(doc, y, "Certificazioni (+15 pt)");
  y = addBullet(doc, y, "Capacita produttiva (+15 pt, -5 se insufficiente)");
  y = addBullet(doc, y, "Budget/FOB (+10 pt, -5 se sopra budget)");
  y = addBullet(doc, y, "Incoterm (+10 pt)");
  y = addBullet(doc, y, "Team multilingue (+5 pt)");
  y = addParagraph(doc, y, "Score finale: 0-100, massimo 5 cantine ordinate per punteggio.");
  y += 2;
  y = addParagraph(doc, y, "COME SCEGLIERE TRA AI E LOCALE:");
  y = addBullet(doc, y, "L'AI parte automaticamente quando disponibile. Se fallisce, il motore locale subentra (fallback)");
  y = addBullet(doc, y, "L'AI capisce sinonimi, sfumature e richieste vaghe. Il locale cerca parole chiave esatte");
  y = addBullet(doc, y, "L'AI genera sintesi narrativa e raccomandazioni personalizzate. Il locale da solo punteggio e motivi tecnici");
  y = addBullet(doc, y, "L'AI e migliore per richieste complesse o non strutturate. Il locale e istantaneo e sempre disponibile");
  y += 2;
  y = addParagraph(doc, y, "DOVE SI USA: Pagina WineryMatch (inserimento richiesta + risultati con score, motivi, raccomandazione, dati chiave MOQ/FOB/incoterms, invio RFQ, scheda tecnica). Pagina AIOverview (panoramica motore AI). Pagina AIEngineDocs (documentazione tecnica). Pagina ExportGuide (come il matching si inserisce nel processo export).");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "GLOSSARIO SIGLE EXPORT E COMMERCIO");
  y += 2;
  y = addParagraph(doc, y, "SIGLE COMMERCIALI E CONTRATTUALI:");
  y = addBullet(doc, y, "RFQ — Request for Quote: richiesta formale di preventivo dal buyer alla cantina. Include paese, volume, tipologia, budget, incoterm");
  y = addBullet(doc, y, "MOQ — Minimum Order Quantity: numero minimo di bottiglie per ordine. Sotto una certa quantita i costi superano il margine");
  y = addBullet(doc, y, "FOB — Free On Board: prezzo della merce caricata sulla nave nel paese di origine. Il venditore paga fino al carico, il compratore da li in poi");
  y = addBullet(doc, y, "SKU — Stock Keeping Unit: identifica una variante di prodotto in magazzino (es. 750ml vs 1.5L)");
  y = addBullet(doc, y, "B2B — Business to Business: vendita tra aziende (cantina -> ristorante, cantina -> buyer estero)");
  y = addBullet(doc, y, "B2C — Business to Consumer: vendita diretta al consumatore finale");
  y += 3;
  y = addParagraph(doc, y, "INCOTERMS (Termini di Consegna Internazionali, 11 regole ICC):");
  y = addParagraph(doc, y, "Gruppo 1 — Trasporto marittimo e via acqua:");
  y = addBullet(doc, y, "FOB — Free On Board: venditore carica la merce sulla nave, compratore paga tutto da li");
  y = addBullet(doc, y, "CIF — Cost, Insurance and Freight: venditore paga trasporto + assicurazione fino al porto di arrivo, compratore paga dazi e sdoganamento");
  y = addBullet(doc, y, "CFR — Cost and Freight: come CIF ma senza assicurazione");
  y = addBullet(doc, y, "FAS — Free Alongside Ship: venditore consegna la merce accanto alla nave (non caricata)");
  y = addBullet(doc, y, "EXW — Ex Works: venditore mette la merce a disposizione nel suo magazzino, compratore paga TUTTO (massimo onere compratore)");
  y += 1;
  y = addParagraph(doc, y, "Gruppo 2 — Qualsiasi modalita di trasporto:");
  y = addBullet(doc, y, "FCA — Free Carrier: venditore consegna la merce al vettore designato dal compratore");
  y = addBullet(doc, y, "CPT — Carriage Paid To: venditore paga trasporto fino alla destinazione, non assicurazione");
  y = addBullet(doc, y, "CIP — Carriage and Insurance Paid To: come CPT + assicurazione pagata dal venditore");
  y = addBullet(doc, y, "DAP — Delivered at Place: venditore consegna al luogo concordato, sdoganamento import a carico del compratore");
  y = addBullet(doc, y, "DDP — Delivered Duty Paid: venditore paga TUTTO incluso dazi e sdoganamento (massimo onere venditore)");
  y = addBullet(doc, y, "DPU — Delivered at Place Unloaded: come DAP ma il venditore scarica anche la merce");
  y += 3;
  y = addParagraph(doc, y, "SIGLE DEL VINO E DELLE DENOMINAZIONI:");
  y = addBullet(doc, y, "DOC — Denominazione di Origine Controllata: vino prodotto in zona delimitata con regole precise (uve, rese, invecchiamento)");
  y = addBullet(doc, y, "DOCG — Denominazione di Origine Controllata e Garantita: livello piu alto del vino italiano, con controlli aggiuntivi e assaggio commissione");
  y = addBullet(doc, y, "IGT — Indicazione Geografica Tipica: garantisce l'origine geografica ma con regole piu flessibili");
  y = addBullet(doc, y, "7 DOC/DOCG dell'Oltrepo Pavese: Metodo Classico DOCG, Pinot Nero DOC, Bonarda DOC, Buttafuoco DOC, Sangue di Giuda DOC, Barbera DOC, Riesling DOC");
  y += 3;
  y = addParagraph(doc, y, "SIGLE DOGANALI E DI CERTIFICAZIONE:");
  y = addBullet(doc, y, "HS Code — Harmonized System Code: codice numerico internazionale per i dazi doganali (vino = capitolo 22, es. 2204.21)");
  y = addBullet(doc, y, "CE — Conformita Europea: marchio che certifica rispetto delle normative UE");
  y = addBullet(doc, y, "HACCP — Hazard Analysis and Critical Control Points: sistema di gestione sicurezza alimentare, obbligatorio per chi manipola alimenti");
  y = addBullet(doc, y, "BRC — British Retail Consortium: standard internazionale di sicurezza alimentare richiesto da molti distributori europei");
  y = addBullet(doc, y, "IFS — International Food Standard: standard sicurezza alimentare diffuso in Germania e Francia");
  y = addBullet(doc, y, "ISO 22000 — Food Safety Management: standard internazionale per la gestione della sicurezza alimentare, comprende HACCP");
  y = addBullet(doc, y, "ISO 9001 — Quality Management: standard internazionale per la gestione della qualita aziendale");
  y = addBullet(doc, y, "ORGANIC/BIO — Vino Biologico: uve da agricoltura biologica (senza pesticidi di sintesi), certificato da ente autorizzato");
  y = addBullet(doc, y, "BIODYNAMIC — Vino Biodinamico: oltre il biologico, segue i principi di Rudolf Steiner (calendario lunare, preparati naturali). Certificato Demeter o Biodyvin");
  y += 3;
  y = addParagraph(doc, y, "SIGLE LOGISTICHE:");
  y = addBullet(doc, y, "LCL — Less than Container Load: spedizione marittima in container condiviso, economico per piccoli volumi (500-2000 bottiglie)");
  y = addBullet(doc, y, "FCL — Full Container Load: container intero noleggiato, economico per volumi grandi (10.000+ bottiglie, 20' tiene ~12.000 bt)");
  y = addBullet(doc, y, "ETA — Estimated Time of Arrival: data stimata di arrivo della merce al porto di destinazione");
  y = addBullet(doc, y, "ETD — Estimated Time of Departure: data stimata di partenza dal porto di origine");
  y = addBullet(doc, y, "BL — Bill of Lading: polizza di carico, documento di trasporto marittimo (contratto, ricevuta, titolo di proprieta)");
  y += 3;
  y = addParagraph(doc, y, "SIGLE AI E TECNICHE DELLA PIATTAFORMA:");
  y = addBullet(doc, y, "IRC — Indice di Reattivita Chimica: punteggio 0-100 per l'abbinamento cibo-vino. Composto da Chimica (0-40) + Aromatico (0-25) + Struttura (0-20) + Pulizia (0-15)");
  y = addBullet(doc, y, "AI — Artificial Intelligence: Claude di Anthropic per l'abbinamento molecolare cibo-vino e il matching cantine-buyer");
  y = addBullet(doc, y, "RLS — Row Level Security: sistema di sicurezza di Supabase/PostgreSQL che limita chi puo leggere/scrivere ogni riga. Ogni tabella ha 4 policy (SELECT, INSERT, UPDATE, DELETE)");

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(doc, i, total);
  }

  // @ts-expect-error jsPDF encrypt option not in type defs
  doc.save("BF45_Linee_Guida.pdf", { encrypt: true, userPassword: password });
}

function generatePresentazione(password: string) {
  const doc = new jsPDF();
  let y = 55;
  let page = 1;

  y = addSectionTitle(doc, y, "COS'E B&F 45");
  y = addParagraph(doc, y, "B&F 45 e la prima piattaforma digitale dedicata all'Oltrepo Pavese, il territorio del vino piu vasto della Lombardia, a 1 ora da Milano. Unisce tre cose che nessuno aveva mai messo insieme:");
  y = addBullet(doc, y, "Una carta dei vini \"viva\" che si aggiorna da sola (stock, prezzi, disponibilita in tempo reale)");
  y = addBullet(doc, y, "Un motore di abbinamento cibo-vino basato su chimica molecolare (non regole empiriche)");
  y = addBullet(doc, y, "Un hub export B2B che connette cantine dell'Oltrepo con buyer internazionali");
  y = addParagraph(doc, y, "Posizionamento: \"A 1 ora da Milano, l'Oltrepo Pavese e il territorio del vino piu vasto della Lombardia.\"");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "IL TERRITORIO: OLTREPO PAVESE");
  y = addBullet(doc, y, "1 ora da Milano");
  y = addBullet(doc, y, "1.350 ettari di vigneti");
  y = addBullet(doc, y, "7 denominazioni DOC/DOCG");
  y = addBullet(doc, y, "110+ etichette in catalogo");
  y = addBullet(doc, y, "12 cantine partner");
  y = addBullet(doc, y, "5 tipologie di vino: Bonarda, Buttafuoco, Sangue di Giuda, Pinot Nero, Metodo Classico DOCG, Riesling, Barbera, Moscato");
  y = addParagraph(doc, y, "Perche l'Oltrepo? E il territorio del vino meno conosciuto tra i grandi d'Italia, ma con numeri da protagonista. Il gap di notorieta e l'opportunita: nessuno ha mai costruito una piattaforma digitale dedicata a questo territorio. Noi lo facciamo.");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "LE 5 AREE FUNZIONALI DELLA PIATTAFORMA");
  y += 2;
  y = addParagraph(doc, y, "1. MOTORE DI ABBINAMENTO IRC (Indice di Reattivita Chimica)");
  y = addParagraph(doc, y, "L'utente descrive un piatto, il motore analizza la chimica del piatto (grassi, proteine, acidi, composti aromatici, piccantezza, umami) e la confronta con la composizione chimica di ogni vino. Punteggio 0-100 basato su 4 componenti: Chimica (0-40), Aromatico (0-25), Struttura (0-20), Pulizia palato (0-15). Due versioni: Motore locale (gratuito) e Motore AI (a pagamento con Claude AI).", 25);
  y += 2;
  y = addParagraph(doc, y, "2. CANTINA (CATALOGO VINI)");
  y = addParagraph(doc, y, "Due sezioni: Oltrepo Pavese (110+ etichette, focus principale) e Resto del mondo. Ogni vino ha scheda tecnica completa, recensioni utenti, punteggio IRC. I vini dell'Oltrepo hanno anche scheda tecnica export, QR dinamico, collegamento alla cantina produttrice.", 25);
  y += 2;
  y = addParagraph(doc, y, "3. HUB EXPORT B2B");
  y = addParagraph(doc, y, "AI Winery Matching: un buyer estero descrive cosa cerca, l'AI incrocia i dati delle 12 cantine e restituisce una shortlist ordinata. RFQ: il buyer invia una richiesta strutturata. Export Process: guida passo-passo. Materiali B2B: risorse scaricabili.", 25);
  y += 2;
  y = addParagraph(doc, y, "4. QR DINAMICO");
  y = addParagraph(doc, y, "A differenza dei competitor che puntano a una pagina fissa, il QR di B&F 45 punta a un endpoint che la cantina aggiorna in tempo reale. Stesso QR fisico stampato una volta sola, contenuto sempre aggiornato.", 25);
  y += 2;
  y = addParagraph(doc, y, "5. STRUMENTI PER RISTORATORI");
  y = addParagraph(doc, y, "Carta vini viva, Wine Lab, Menu QR, Dashboard ristorante, Analytics con statistiche su ricerche, vini piu popolari, abbinamenti piu richiesti.", 25);

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "MODELLO DI BUSINESS");
  y = addParagraph(doc, y, "B2C (Privati): Abbinamento gratuito con motore locale, abbinamento AI con codice di accesso, vendita diretta vini, BF45 Premium per sommelier personale con AI");
  y = addParagraph(doc, y, "B2B (Ristoratori): Carta vini viva da 49 EUR/mese con 14 giorni di prova, QR code menu incluso, consulenza AI inclusa, formazione staff premium");
  y = addParagraph(doc, y, "B2B Export (Cantine): Iscrizione gratuita con QR dinamico, AI Winery Matching a pagamento, RFQ con commissione su transazione, Materiali B2B gratuiti per cantine partner");

  y += 5;
  y = addSectionTitle(doc, y, "COMPETITOR E DIFFERENZIAZIONE");
  y = addBullet(doc, y, "QuveeR / Winetraqr: QR code fisso su bottiglia -> noi: QR dinamico aggiornabile in tempo reale");
  y = addBullet(doc, y, "Vivino: recensioni e rating -> noi: abbinamento molecolare + focus territoriale Oltrepo");
  y = addBullet(doc, y, "Wine-Searcher: motore di ricerca prezzi -> noi: motore di abbinamento chimico + export B2B");
  y = addBullet(doc, y, "Nessun competitor ha mai costruito una piattaforma dedicata all'Oltrepo Pavese");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "NUMERI CHIAVE");
  y = addBullet(doc, y, "110+ etichette in catalogo (tutte dell'Oltrepo)");
  y = addBullet(doc, y, "12 cantine partner");
  y = addBullet(doc, y, "7 denominazioni DOC/DOCG");
  y = addBullet(doc, y, "7 lingue supportate (IT, EN, FR, ES, DE, JP, NL)");
  y = addBullet(doc, y, "3 edge functions deployate (AI pairing, AI winery match, analytics)");
  y = addBullet(doc, y, "4 tabelle Supabase (RFQ, QR data, codici AI, candidature)");
  y = addBullet(doc, y, "Motore AI basato su Claude (Anthropic) — Haiku base + Sonnet 4 PRO");

  y += 5;
  y = addSectionTitle(doc, y, "TECNOLOGIA");
  y = addBullet(doc, y, "Frontend: React + TypeScript + Vite");
  y = addBullet(doc, y, "Backend: Supabase (PostgreSQL, RLS, Edge Functions Deno)");
  y = addBullet(doc, y, "AI: Claude Haiku (base) + Claude Sonnet 4 (PRO) per abbinamento molecolare");
  y = addBullet(doc, y, "Database: 4 migrazioni attive (RFQ, QR dinamico, codici AI, candidature)");
  y = addBullet(doc, y, "Lingue: 7 (IT/EN/FR/ES/DE/JP/NL) con traduzioni complete");

  y += 5;
  y = addSectionTitle(doc, y, "PROSSIMI PASSI");
  y = addBullet(doc, y, "Onboarding cantine: dalle 12 partner a 30+ nel 2026");
  y = addBullet(doc, y, "Attivazione pagamenti reali (Stripe)");
  y = addBullet(doc, y, "App mobile (QR scan per clienti al tavolo)");
  y = addBullet(doc, y, "Partnership con enti del territorio (Strada del Vino Oltrepo, Camera di Commercio Pavia)");
  y = addBullet(doc, y, "Espansione catalogo: da 110 a 200+ etichette");
  y = addBullet(doc, y, "API pubblica per integrazioni terze (POS, e-commerce cantine)");

  y += 5;
  y = addSectionTitle(doc, y, "CONTATTI");
  y = addParagraph(doc, y, "B&F 45");
  y = addParagraph(doc, y, "Oltrepo Pavese, Lombardia");
  y = addParagraph(doc, y, "piattaforma online: bf45.bolt.app");
  y = addParagraph(doc, y, "Email: federico.bosoni@gmail.com");

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(doc, i, total);
  }

  // @ts-expect-error jsPDF encrypt option not in type defs
  doc.save("BF45_Presentazione_Investitori.pdf", { encrypt: true, userPassword: password });
}

function generateEmailInvestitori(password: string) {
  const doc = new jsPDF();
  let y = 55;
  let page = 1;

  y = addSectionTitle(doc, y, "EMAIL 1: PRIMO CONTATTO (COLD EMAIL)");
  y = addParagraph(doc, y, "Oggetto: B&F 45 — il portale digitale dell'Oltrepo Pavese per investitori");
  y += 2;
  y = addParagraph(doc, y, "Gentile [Nome],");
  y = addParagraph(doc, y, "sono Federico Bosoni, fondatore di B&F 45, la prima piattaforma digitale dedicata all'Oltrepo Pavese — il territorio del vino piu vasto della Lombardia, a 1 ora da Milano.");
  y = addParagraph(doc, y, "Abbiamo costruito un portale che unisce tre cose che nessuno aveva mai messo insieme per questo territorio:");
  y = addBullet(doc, y, "Un motore di abbinamento cibo-vino basato su chimica molecolare (non regole empiriche), con AI integrata");
  y = addBullet(doc, y, "Un hub export B2B che connette le cantine dell'Oltrepo con buyer internazionali tramite AI matching e RFQ strutturati");
  y = addBullet(doc, y, "Una carta vini viva con QR dinamico per ristoratori");
  y = addParagraph(doc, y, "Numeri attuali: 110+ etichette in catalogo, 12 cantine partner, 7 denominazioni DOC/DOCG, 7 lingue supportate, motore AI basato su Claude gia operativo, 3 modelli di monetizzazione attivi (B2C, B2B ristoratori, B2B export).");
  y = addParagraph(doc, y, "Stiamo cercando investitori che credano nel potenziale di un territorio del vino ancora poco conosciuto ma con numeri da protagonista. L'Oltrepo Pavese ha 1.350 ettari di vigneti e oltre 100 etichette, ma nessuno ha mai costruito una piattaforma digitale dedicata. Noi lo stiamo facendo.");
  y = addParagraph(doc, y, "Sarei felice di presentarvi il progetto in dettaglio. Potete trovare una panoramica completa delle funzionalita e del modello di business nel documento di presentazione allegato.");
  y = addParagraph(doc, y, "Resto a disposizione per un incontro.");
  y = addParagraph(doc, y, "Cordiali saluti,");
  y = addParagraph(doc, y, "Federico Bosoni");
  y = addParagraph(doc, y, "federico.bosoni@gmail.com");
  y = addParagraph(doc, y, "B&F 45 — Intelligent Wine Pairing & Curated Cellar");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "EMAIL 2: FOLLOW-UP DOPO PRIMO CONTATTO");
  y = addParagraph(doc, y, "Oggetto: Re: B&F 45 — aggiornamenti e prossimi passi");
  y += 2;
  y = addParagraph(doc, y, "Gentile [Nome],");
  y = addParagraph(doc, y, "torno a scrivervi dopo il nostro primo contatto per condividere alcuni aggiornamenti su B&F 45:");
  y = addBullet(doc, y, "Abbiamo completato la riorganizzazione del catalogo con separazione tra vini dell'Oltrepo (focus principale) e resto del mondo");
  y = addBullet(doc, y, "Il motore AI di abbinamento molecolare e ora operativo con sistema di codici di accesso (modello freemium/abbonamento)");
  y = addBullet(doc, y, "Abbiamo lanciato il form \"Lavora con noi\" che ha gia ricevuto le prime candidature da cantine e ristoratori interessati a unirsi alla piattaforma");
  y = addBullet(doc, y, "Il pannello di gestione e stato reso professionale con dashboard analytics completa");
  y = addParagraph(doc, y, "Prossimi passi che vediamo per i prossimi 6 mesi:");
  y = addBullet(doc, y, "Onboarding cantine: dalle 12 partner a 30+");
  y = addBullet(doc, y, "Attivazione pagamenti reali (Stripe)");
  y = addBullet(doc, y, "App mobile per scan QR al tavolo");
  y = addBullet(doc, y, "Partnership con enti del territorio (Strada del Vino Oltrepo, Camera di Commercio Pavia)");
  y = addBullet(doc, y, "Espansione catalogo: da 110 a 200+ etichette");
  y = addParagraph(doc, y, "Sarei lieto di mostrarvi una demo live della piattaforma e discutere le modalita di investimento.");
  y = addParagraph(doc, y, "Cordiali saluti, Federico Bosoni");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "EMAIL 3: INVITO A DEMO LIVE");
  y = addParagraph(doc, y, "Oggetto: B&F 45 — invito a demo live della piattaforma");
  y += 2;
  y = addParagraph(doc, y, "Gentile [Nome],");
  y = addParagraph(doc, y, "vi invito a una demo live di B&F 45, la piattaforma digitale dell'Oltrepo Pavese.");
  y = addParagraph(doc, y, "Durante la demo vi mostrero:");
  y = addBullet(doc, y, "Il motore di abbinamento molecolare in azione (proveremo piatti reali e vedremo come calcola il punteggio IRC)");
  y = addBullet(doc, y, "Il catalogo vini con 110+ etichette dell'Oltrepo e vini del resto del mondo");
  y = addBullet(doc, y, "L'hub export B2B con AI Winery Matching e RFQ");
  y = addBullet(doc, y, "Il QR dinamico per cantine e ristoratori");
  y = addBullet(doc, y, "Il pannello di gestione con analytics");
  y = addBullet(doc, y, "Il modello di business e i numeri attuali");
  y = addParagraph(doc, y, "La demo dura circa 30 minuti e puo essere fatta in presenza o in videochiamata, in base alle vostre preferenze.");
  y = addParagraph(doc, y, "Proposte di date: [Data 1] alle [Ora] / [Data 2] alle [Ora] / [Data 3] alle [Ora]");
  y = addParagraph(doc, y, "Fatemi sapere quale data vi e piu comoda, oppure proponetemi un altro momento.");
  y = addParagraph(doc, y, "Cordiali saluti, Federico Bosoni, federico.bosoni@gmail.com, B&F 45 — Intelligent Wine Pairing & Curated Cellar");

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(doc, i, total);
  }

  // @ts-expect-error jsPDF encrypt option not in type defs
  doc.save("BF45_Email_Investitori.pdf", { encrypt: true, userPassword: password });
}

function generateAITech(password: string) {
  const doc = new jsPDF();
  let y = 55;
  let page = 1;

  y = addSectionTitle(doc, y, "PANORAMICA AI DI BWINE");
  y = addParagraph(doc, y, "Bwine usa l'intelligenza artificiale di Claude (Anthropic) per due funzioni principali: l'abbinamento molecolare cibo-vino e il matching cantine-buyer per l'export. Oltre a queste, ci sono funzioni PRO di analisi avanzata e un motore locale sempre disponibile come alternativa gratuita.");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "1. ABBINAMENTO CIBO-VINO (IRC)");
  y = addParagraph(doc, y, "Disponibile in: Abbinamenti, Wine Lab, Reverse Pairing, Wine Detail");
  y = addParagraph(doc, y, "Il motore IRC analizza il piatto a livello molecolare e calcola la compatibilita con ogni vino del catalogo. Identifica grassi, proteine, acidi, volatili, piccantezza, umami e dolcezza, poi applica 15 principi chimico-enologici per assegnare un punteggio 0-100.");
  y = addBullet(doc, y, "15 principi chimici (emulsione lipidica, tannini-proteine, capsaicina TRPV1, equilibrio acido, umami, mineralita, Maillard, dolce-dolce, spezie terpeniche, CO2 palato, temperatura volatilita, alcol-dolcezza, acidita-salivazione, corpo-intensita, astringenza-succulenza)");
  y = addBullet(doc, y, "4 dimensioni IRC: Chimica (0-40), Aromatico (0-25), Struttura (0-20), Pulizia (0-15)");
  y = addBullet(doc, y, "Composti chimici citati per nome esatto (acido tartarico, procianidine B1-B4, linalolo, ecc.)");
  y = addBullet(doc, y, "Discorso narrativo \"perche del vino\" per ogni abbinamento");
  y = addParagraph(doc, y, "Modelli: Base: Claude 3.5 Haiku (4k token) | PRO: Claude Sonnet 4 (6k token)");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "2. MATCHING CANTINA-BUYER (EXPORT)");
  y = addParagraph(doc, y, "Disponibile in: AI Matching, Winery Match");
  y = addParagraph(doc, y, "Il matching cantine-buyer abbinia un buyer estero (importatore, distributore, ristorante) alla cantina dell'Oltrepo Pavese piu adatta. Due modalita: motore AI (Claude Haiku, 3000 token, temperature 0) e motore locale (sempre disponibile, senza codice).");
  y += 2;
  y = addParagraph(doc, y, "MOTORE AI — 8 criteri di valutazione (punteggio 0-100 per cantina):");
  y = addBullet(doc, y, "Tipologia vino richiesta vs tipologie prodotte dalla cantina");
  y = addBullet(doc, y, "Denominazione richiesta vs denominazioni della cantina");
  y = addBullet(doc, y, "Volume richiesto vs capacita produttiva (1 hl = 133 bottiglie)");
  y = addBullet(doc, y, "Budget vs prezzo FOB della cantina");
  y = addBullet(doc, y, "Mercato target vs paesi gia serviti (esperienza export)");
  y = addBullet(doc, y, "Certificazioni richieste vs possedute (Bio, Vegan, BRC, IFS, ISO)");
  y = addBullet(doc, y, "Incoterms richiesti vs accettati (FOB, CIF, EXW, DDP, DAP)");
  y = addBullet(doc, y, "Lingue del team vs mercato target (es. giapponese per buyer JP)");
  y = addParagraph(doc, y, "Output per cantina con score >= 30: score, reasons (motivi + e -), recommendation (sintesi), sintesi generale.");
  y = addParagraph(doc, y, "Esempi richieste: \"Bonarda bio per Germania, 2000 bt, FOB\" / \"Buttafuoco Storico premium per USA, 1000 bt, bio\" / \"Moscato dolce per Taiwan, CIF, 3000 bt\"");
  y = addParagraph(doc, y, "Sicurezza: rate limiting 10 req/min per IP, body limit 100KB, max 50 cantine per richiesta.");
  y += 2;
  y = addParagraph(doc, y, "MOTORE LOCALE — 9 criteri con pesi (sempre disponibile, senza codice):");
  y = addBullet(doc, y, "Export readiness (+15 pt)");
  y = addBullet(doc, y, "Denominazione (+25 pt)");
  y = addBullet(doc, y, "Tipologia vino (+15 pt)");
  y = addBullet(doc, y, "Paese/mercato (+20 pt se gia serve, +8 pt se nuovo mercato)");
  y = addBullet(doc, y, "Certificazioni (+15 pt)");
  y = addBullet(doc, y, "Capacita produttiva (+15 pt, -5 se insufficiente)");
  y = addBullet(doc, y, "Budget/FOB (+10 pt, -5 se sopra budget)");
  y = addBullet(doc, y, "Incoterm (+10 pt)");
  y = addBullet(doc, y, "Team multilingue (+5 pt)");
  y = addParagraph(doc, y, "Score finale: 0-100, massimo 5 cantine ordinate per punteggio. L'AI parte automaticamente quando disponibile; se fallisce, il motore locale subentra (fallback). L'AI capisce sinonimi e richieste vaghe, il locale cerca parole chiave esatte.");
  y += 2;
  y = addParagraph(doc, y, "DOVE SI USA: WineryMatch (inserimento richiesta + risultati con score, motivi, raccomandazione, dati chiave MOQ/FOB/incoterms, invio RFQ, scheda tecnica). AIOverview (panoramica). AIEngineDocs (documentazione tecnica). ExportGuide (processo export completo).");
  y = addParagraph(doc, y, "Modello AI: Claude 3.5 Haiku con analisi semantica, 3000 token, temperature 0");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "2b. GLOSSARIO SIGLE EXPORT");
  y = addParagraph(doc, y, "Le sigle che trovi nella piattaforma e nei documenti di export:");
  y += 1;
  y = addParagraph(doc, y, "SIGLE COMMERCIALI:");
  y = addBullet(doc, y, "RFQ — Request for Quote: richiesta formale di preventivo dal buyer alla cantina");
  y = addBullet(doc, y, "MOQ — Minimum Order Quantity: numero minimo di bottiglie per ordine");
  y = addBullet(doc, y, "FOB — Free On Board: prezzo merce caricata sulla nave nel paese di origine");
  y = addBullet(doc, y, "SKU — Stock Keeping Unit: variante di prodotto in magazzino");
  y = addBullet(doc, y, "B2B — Business to Business: vendita tra aziende");
  y = addBullet(doc, y, "B2C — Business to Consumer: vendita diretta al consumatore");
  y += 2;
  y = addParagraph(doc, y, "INCOTERMS (11 regole ICC):");
  y = addBullet(doc, y, "FOB — Free On Board: venditore carica sulla nave, compratore paga da li");
  y = addBullet(doc, y, "CIF — Cost, Insurance and Freight: venditore paga trasporto + assicurazione fino a porto arrivo");
  y = addBullet(doc, y, "CFR — Cost and Freight: come CIF senza assicurazione");
  y = addBullet(doc, y, "FAS — Free Alongside Ship: merce accanto alla nave (non caricata)");
  y = addBullet(doc, y, "EXW — Ex Works: compratore ritira e paga tutto (max onere compratore)");
  y = addBullet(doc, y, "FCA — Free Carrier: venditore consegna al vettore designato");
  y = addBullet(doc, y, "CPT — Carriage Paid To: venditore paga trasporto fino a destinazione");
  y = addBullet(doc, y, "CIP — Carriage and Insurance Paid To: come CPT + assicurazione");
  y = addBullet(doc, y, "DAP — Delivered at Place: venditore consegna, compratore sdogana");
  y = addBullet(doc, y, "DDP — Delivered Duty Paid: venditore paga tutto incluso dazi (max onere venditore)");
  y = addBullet(doc, y, "DPU — Delivered at Place Unloaded: come DAP + scarico merce");
  y += 2;
  y = addParagraph(doc, y, "DENOMINAZIONI VINO:");
  y = addBullet(doc, y, "DOC — Denominazione di Origine Controllata: zona delimitata con regole precise");
  y = addBullet(doc, y, "DOCG — DOC Garantita: livello piu alto, con controlli aggiuntivi e assaggio commissione");
  y = addBullet(doc, y, "IGT — Indicazione Geografica Tipica: origine garantita, regole piu flessibili");
  y = addBullet(doc, y, "7 DOC/DOCG Oltrepo: Metodo Classico DOCG, Pinot Nero, Bonarda, Buttafuoco, Sangue di Giuda, Barbera, Riesling");
  y += 2;
  y = addParagraph(doc, y, "CERTIFICAZIONI:");
  y = addBullet(doc, y, "HS Code — Harmonized System: codice dazi doganali (vino = cap. 22)");
  y = addBullet(doc, y, "CE — Conformita Europea: rispetto normative UE");
  y = addBullet(doc, y, "HACCP — Hazard Analysis: sistema sicurezza alimentare, obbligatorio");
  y = addBullet(doc, y, "BRC — British Retail Consortium: standard sicurezza alimentare (UK, nord-Europa)");
  y = addBullet(doc, y, "IFS — International Food Standard: standard sicurezza (Germania, Francia)");
  y = addBullet(doc, y, "ISO 22000 — Food Safety Management: gestione sicurezza alimentare");
  y = addBullet(doc, y, "ISO 9001 — Quality Management: gestione qualita aziendale");
  y = addBullet(doc, y, "ORGANIC/BIO — Vino Biologico: uve da agricoltura biologica, certificato da ente");
  y = addBullet(doc, y, "BIODYNAMIC — Vino Biodinamico: principi Steiner, certificato Demeter/Biodyvin");
  y += 2;
  y = addParagraph(doc, y, "LOGISTICA:");
  y = addBullet(doc, y, "LCL — Less than Container Load: container condiviso, per piccoli volumi");
  y = addBullet(doc, y, "FCL — Full Container Load: container intero, per grandi volumi (20' = ~12.000 bt)");
  y = addBullet(doc, y, "ETA — Estimated Time of Arrival: data stimata arrivo");
  y = addBullet(doc, y, "ETD — Estimated Time of Departure: data stimata partenza");
  y = addBullet(doc, y, "BL — Bill of Lading: polizza di carico (contratto, ricevuta, titolo di proprieta)");
  y += 2;
  y = addParagraph(doc, y, "PIATTAFORMA:");
  y = addBullet(doc, y, "IRC — Indice di Reattivita Chimica: punteggio 0-100 (Chimica 0-40 + Aromatico 0-25 + Struttura 0-20 + Pulizia 0-15)");
  y = addBullet(doc, y, "AI — Artificial Intelligence: Claude di Anthropic per abbinamento e matching");
  y = addBullet(doc, y, "RLS — Row Level Security: limita chi puo leggere/scrivere ogni riga (4 policy per tabella)");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "3. GEOMAPPING SATELLITARE");
  y = addParagraph(doc, y, "Disponibile in: Mappa Cantine, Wine Map");
  y = addParagraph(doc, y, "Mappa interattiva con coordinate GPS reali per ogni cantina dell'Oltrepo Pavese. Layer satellitare Esri + OpenStreetMap via Leaflet. Poligoni GeoJSON per le 4 zone DOC.");
  y = addBullet(doc, y, "Esri World Imagery (satellitare)");
  y = addBullet(doc, y, "OpenStreetMap vettoriale");
  y = addBullet(doc, y, "Leaflet.js");
  y = addBullet(doc, y, "GeoJSON zone DOC");
  y = addParagraph(doc, y, "Non usa AI — tecnologia geospaziale pura");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "4. ANALISI DIGESTIVA (PRO)");
  y = addParagraph(doc, y, "Disponibile in: Abbinamenti (PRO), Wine Detail (PRO)");
  y = addParagraph(doc, y, "In modalita PRO, il motore considera l'impatto digestivo dell'abbinamento: acidita e secrezione gastrica, tannini e digestione proteica, CO2 e sazieta, etanolo e assorbimento vitaminico, zuccheri e disarmonia digestiva.");
  y = addBullet(doc, y, "5 dimensioni digestive");
  y = addBullet(doc, y, "Solo modalita PRO");
  y = addBullet(doc, y, "Integrato nel discorso perche del vino");
  y = addParagraph(doc, y, "Modello: Solo PRO con Claude Sonnet 4");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "FUNZIONI PRO");
  y = addBullet(doc, y, "Modalita PRO: analisi molecolare avanzata con discorsi narrativi di 4-5 righe, temperatura di servizio calcolata, tempo di decantazione, molecole protagoniste (4-8 composti)");
  y = addBullet(doc, y, "Molecole protagoniste: ogni abbinamento elenca i composti chimici coinvolti per nome esatto");
  y = addBullet(doc, y, "Temperatura di servizio: calcolata in base alla volatilita dei composti aromatici (costante di Henry)");
  y = addBullet(doc, y, "Tempo di decantazione: minuti consigliati basati sul livello di tannini e peso molecolare");
  y = addBullet(doc, y, "Scoring IRC granulare: chimica, aromatico, struttura, pulizia con pesi specifici");
  y = addBullet(doc, y, "Sicurezza e limiti: rate limiting 10 req/min per IP, codici con limite totale + giornaliero, sanitizzazione input, RLS");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "CODICI DI ACCESSO");
  y = addBullet(doc, y, "BF45PROVA — demo: 100 usi totali, 50/giorno, piano trial");
  y = addBullet(doc, y, "BF45PRO — PRO: 10.000 usi totali, 100/giorno, piano monthly, sblocca modalita PRO");
  y = addBullet(doc, y, "BF45TRIAL — trial: 50 usi totali, 30/giorno, piano trial");
  y += 3;
  y = addParagraph(doc, y, "Il limite giornaliero si resetta automaticamente 24 ore dopo il primo uso della giornata. Il contatore e nel database, condiviso tra dispositivi. Quando il limite e raggiunto, l'app usa il motore locale automaticamente.");

  y = newPage(doc); page++;
  y = addSectionTitle(doc, y, "STACK TECNOLOGICO AI");
  y = addBullet(doc, y, "Modelli AI: Claude 3.5 Haiku (base) + Claude Sonnet 4 (PRO)");
  y = addBullet(doc, y, "Runtime: Supabase Edge Functions (Deno)");
  y = addBullet(doc, y, "Database: PostgreSQL con tabelle ai_access_codes, winery_qr_data, rfq_requests");
  y = addBullet(doc, y, "Sicurezza: rate limiting 10/min, codici con limite totale + giornaliero, RLS, CORS, sanitizzazione");
  y = addBullet(doc, y, "Motore locale: algoritmo TypeScript deterministico, sempre disponibile, <50ms");
  y = addBullet(doc, y, "GeoMapping: Leaflet.js + Esri World Imagery + OpenStreetMap + GeoJSON");

  y += 5;
  y = addSectionTitle(doc, y, "COME PROVARE L'AI (DEMO)");
  y = addBullet(doc, y, "1. Vai su Abbinamenti e cerca un piatto (es. \"bistecca alla fiorentina\")");
  y = addBullet(doc, y, "2. Nei risultati, clicca \"Sblocca AI\" e inserisci il codice BF45PROVA (50 usi/giorno)");
  y = addBullet(doc, y, "3. Scegli \"Motore AI\" per usare l'intelligenza artificiale, o \"Motore locale\" per l'algoritmo gratuito");
  y = addBullet(doc, y, "4. Con il codice BF45PRO puoi attivare la Modalita PRO per analisi molecolare avanzata con Claude Sonnet 4");
  y = addBullet(doc, y, "5. Vai su AI Matching per provare il matching cantine-buyer con AI per l'export");

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(doc, i, total);
  }

  // @ts-expect-error jsPDF encrypt option not in type defs
  doc.save("BF45_AI_Tecnologie.pdf", { encrypt: true, userPassword: password });
}

export default function Documenti() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleGenerate = (doc: DocDef) => {
    setGenerating(doc.id);
    setTimeout(() => {
      doc.generate(ADMIN_PASSWORD);
      setGenerating(null);
    }, 300);
  };

  const docs: DocDef[] = [
    {
      id: "linee-guida",
      title: "Linee Guida Piattaforma",
      desc: "Manuale completo: accesso admin, codici AI, tabelle database, edge functions, menu, lingue, modalita PRO, AI matching cantine-buyer, glossario sigle export.",
      icon: BookOpen,
      color: "bg-bordeaux-50 border-bordeaux-200",
      generate: generateLineeGuida,
    },
    {
      id: "presentazione",
      title: "Presentazione Investitori",
      desc: "Pitch deck completo: cos'e B&F 45, il territorio Oltrepo, le 5 aree funzionali, modello di business, competitor, numeri chiave, tecnologia, prossimi passi.",
      icon: Briefcase,
      color: "bg-gold-50 border-gold-200",
      generate: generatePresentazione,
    },
    {
      id: "email-investitori",
      title: "Email per Investitori",
      desc: "3 template di email pronti da inviare: primo contatto (cold email), follow-up dopo primo contatto, invito a demo live.",
      icon: Mail,
      color: "bg-cream-50 border-cream-200",
      generate: generateEmailInvestitori,
    },
    {
      id: "ai-tech",
      title: "AI & Tecnologie",
      desc: "Documentazione AI: abbinamento IRC, matching cantine-buyer (8 criteri AI + 9 criteri locale), glossario sigle export, geomapping, analisi digestiva PRO, codici, stack.",
      icon: Brain,
      color: "bg-bordeaux-50 border-bordeaux-200",
      generate: generateAITech,
    },
  ];

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <Lock className="w-10 h-10 text-gold-400 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-cream-50 text-center">Documenti Protetti</h1>
          <p className="text-sm text-cream-300 text-center mt-2">I documenti contengono informazioni riservate (password admin, codici AI). Inserisci la password admin per accedere.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) { setUnlocked(true); setError(false); } else { setError(true); } }}
            className="mt-6"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password admin"
              className="w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            {error && <p className="text-xs text-red-400 mt-2">Password errata</p>}
            <button type="submit" className="w-full mt-3 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors">
              Sblocca documenti
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center justify-center gap-1.5">
            <FileDown className="w-3.5 h-3.5" /> Documenti scaricabili
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">Documenti B&F 45</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl mx-auto">
            Scarica i documenti della piattaforma in formato PDF. Ogni documento e generato direttamente nel browser e pronto per la stampa o la condivisione.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc, i) => (
            <div
              key={doc.id}
              className={`p-6 rounded-xl border ${doc.color} hover:shadow-lg transition-all animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-bordeaux-950 flex items-center justify-center shrink-0">
                  <doc.icon className="w-6 h-6 text-gold-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-bordeaux-950">{doc.title}</h3>
                  <p className="text-xs text-bordeaux-600 mt-1 leading-relaxed">{doc.desc}</p>
                  <button
                    onClick={() => handleGenerate(doc)}
                    disabled={generating === doc.id}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-semibold hover:bg-bordeaux-700 transition-colors disabled:opacity-50"
                  >
                    {generating === doc.id ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generazione...</>
                    ) : (
                      <><Download className="w-4 h-4" /> Scarica PDF</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 rounded-xl bg-bordeaux-950 text-cream-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gold-400/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-gold-400">Nota sulla sicurezza</h3>
              <p className="text-xs text-cream-200 mt-1 leading-relaxed">
                I PDF vengono generati nel browser e protetti con password. I documenti contengono informazioni operative (password admin, codici AI) — trattali con la stessa cautela del file LINEE_GUIDA. Non condividere i PDF con persone esterne all'organizzazione. Per aprire i PDF usa la password admin.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 rounded-xl bg-cream-50 border border-cream-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-bordeaux-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-gold-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-bordeaux-950">Linee Guida Complete (PDF formattato)</h3>
              <p className="text-xs text-bordeaux-600 mt-1 leading-relaxed">
                Versione PDF formattata con copertina, indice e glossario completo di tutte le sigle export (RFQ, MOQ, FOB, incoterms, DOC/DOCG, HACCP, BRC, IFS, LCL, FCL, IRC, RLS). Include anche la sezione sull'uso dell'AI nel matching cantine-buyer.
              </p>
              <a
                href="/LINEE_GUIDA_BF45.pdf"
                download="BF45_Linee_Guida_Completo.pdf"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-semibold hover:bg-bordeaux-700 transition-colors"
              >
                <Download className="w-4 h-4" /> Scarica PDF formattato
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-1.5 text-xs text-bordeaux-500">
              <Check className="w-3 h-3 text-green-600" />
              {doc.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
