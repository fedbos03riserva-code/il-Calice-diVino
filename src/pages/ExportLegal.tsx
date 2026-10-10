import { useState } from "react";
import { Scale, Search, ChevronDown, AlertTriangle, FileText, CheckCircle, X, Globe2 } from "lucide-react";

type CountryLegal = {
  code: string;
  name: string;
  flag: string;
  eu: boolean;
  tariff: string;
  vat: string;
  excise: string;
  labeling: string;
  certifications: string;
  docRequired: string[];
  restrictions: string[];
  notes: string;
};

const countries: CountryLegal[] = [
  {
    code: "DE", name: "Germania", flag: "🇩🇪", eu: true,
    tariff: "0% (intracomunitario)", vat: "19%", excise: "€0.136/bt (vino fermo), €0.136/bt (spumante)",
    labeling: "Etichetta in tedesco obbligatoria: nome prodotto, volume, gradazione alcolica, allergeni, lotto, paese di origine",
    certifications: "Non obbligatorie ma consigliate BRC/IFS per GDO",
    docRequired: ["Certificato di origine", "Documento di accompagnamento (EMCS)"],
    restrictions: ["Limite SO2: 210 mg/L per vini rossi", "Divieto additivi non UE"],
    notes: "Mercato principale dell'Oltrepò. Distribuzione via GDO richiede BRC/IFS. Buyer sensibili a BIO e sostenibilita.",
  },
  {
    code: "JP", name: "Giappone", flag: "🇯🇵", eu: false,
    tariff: "15% (WTO) o tariffa preferenziale EPA UE-Giappone", vat: "10%", excise: "¥80/L (vino fermo)",
    labeling: "Etichetta in giapponese: nome, contenuto, importatore, gradazione, allergeni (solfiti)",
    certifications: "Analisi laboratorio accreditato, certificato sanitario",
    docRequired: ["Certificato di origine EUR.1 (per tariffa EPA)", "Certificato fitosanitario", "Analisi chimiche"],
    restrictions: ["Limite diacile 2 mg/L", "Notifica pre-arrivo al porto"],
    notes: "Mercato premium per Metodo Classico e Pinot Nero. L'EPA UE-Giappone riduce i dazi. Importante avere un importatore locale.",
  },
  {
    code: "USA", name: "Stati Uniti", flag: "🇺🇸", eu: false,
    tariff: "5.9% (HTS 2204.21)", vat: "Varia per stato (0-9%)", excise: "Varia per stato ($0.21-$2.50/L)",
    labeling: "Etichetta FDA:health warning obbligatoria, SO2 >10mg/L dichiarato, nome importatore, lotto",
    certifications: "Registrazione FDA, tipo TTB (COLA) per approvazione etichetta",
    docRequired: ["Certificato di origine", "Notifica prior-notice FDA", "Approvazione COLA"],
    restrictions: ["Salicilati: analisi richiesta", "Etichetta deve essere approvata prima dell'import"],
    notes: "Mercato grande ma complesso. Ogni stato ha regole proprie per distribuzione (three-tier system). Serve un importatore/distributore.",
  },
  {
    code: "UK", name: "Regno Unito", flag: "🇬🇧", eu: false,
    tariff: "0% (TCA UE-UK) se regola di origine soddisfatta", vat: "20%", excise: "£2.23/L (vino fermo >8% vol)",
    labeling: "Etichetta in inglese: nome, volume, gradazione, allergeni, paese origine, lotto, importatore UK",
    certifications: "Non obbligatorie, BRC/IFS per GDO",
    docRequired: ["Certificato di origine UK-EU", "Dichiarazione valore", "Documento doganale"],
    restrictions: ["Limite SO2: 210 mg/L rossi", "BREXIT: controlli sanitari SPS dal 2024"],
    notes: "Post-Brexit serve importatore UK registrato. TCA elimina dazi se vino 100% UE. Mercato key per premium.",
  },
  {
    code: "FR", name: "Francia", flag: "🇫🇷", eu: true,
    tariff: "0% (intracomunitario)", vat: "20%", excise: "€0.038/bt (vino fermo)",
    labeling: "Etichetta in francese obbligatoria",
    certifications: "Non obbligatorie",
    docRequired: ["Documento EMCS", "Certificato di origine"],
    restrictions: ["Limite SO2: 210 mg/L rossi", "Divieto pratica dealcolizzazione per DOC"],
    notes: "Concorrenza diretta ma mercato grande. Focus su vini di nicchia (Riesling, Buttafuoco) non competono con produzione locale.",
  },
  {
    code: "CH", name: "Svizzera", flag: "🇨🇭", eu: false,
    tariff: "0% (Accordo UE-Svizzera) fino a contingente, poi tariffa", vat: "8.1%", excise: "CHF 0-2/L seconda tipologia",
    labeling: "Etichetta in almeno una lingua nazionale (tedesco, francese, italiano)",
    certifications: "Importatore svizzero deve essere registrato",
    docRequired: ["Dichiarazione doganale T2", "Certificato di origine", "Fattura commerciale"],
    restrictions: ["Contingente tariffario annuale", "Etichetta con importatore svizzero"],
    notes: "Mercato premium vicino. Contingente doganale gestito dall'importatore. Eccellente per vini di nicchia.",
  },
  {
    code: "NL", name: "Paesi Bassi", flag: "🇳🇱", eu: true,
    tariff: "0% (intracomunitario)", vat: "21%", excise: "€0.085/bt (vino fermo)",
    labeling: "Etichetta in olandese o inglese",
    certifications: "BRC/IFS per GDO",
    docRequired: ["Documento EMCS", "Certificato di origine"],
    restrictions: ["Limite SO2: 210 mg/L rossi"],
    notes: "Hub logistico per Nord Europa. Rotterdam porta principale per re-export. Importanti per BIO.",
  },
  {
    code: "BE", name: "Belgio", flag: "🇧🇪", eu: true,
    tariff: "0% (intracomunitario)", vat: "21%", excise: "€0.085/bt (vino fermo)",
    labeling: "Etichetta in francese/olandese/tedesco",
    certifications: "Non obbligatorie",
    docRequired: ["Documento EMCS", "Certificato di origine"],
    restrictions: ["Limite SO2: 210 mg/L rossi"],
    notes: "Mercato piccolo ma sofisticato. Bruxelles sede di molte istituzioni UE, buyer internazionali.",
  },
  {
    code: "SE", name: "Svezia", flag: "🇸🇪", eu: true,
    tariff: "0% (intracomunitario)", vat: "25%", excise: "SEK 27.83/L (vino fermo >8.5%)",
    labeling: "Etichetta in svedese obbligatoria",
    certifications: "Approvazione Systembolaget",
    docRequired: ["Documento EMCS", "Registrazione Systembolaget"],
    restrictions: ["Monopolio statale: solo Systembolaget puo vendere al dettaglio", "Test panel obbligatorio"],
    notes: "Mercato monopolio. Systembolaget seleziona prodotti via test panel. Premium e BIO molto richiesti.",
  },
  {
    code: "DK", name: "Danimarca", flag: "🇩🇰", eu: true,
    tariff: "0% (intracomunitario)", vat: "25%", excise: "DKK 4.50/L (vino fermo)",
    labeling: "Etichetta in danese",
    certifications: "Non obbligatorie",
    docRequired: ["Documento EMCS", "Certificato di origine"],
    restrictions: ["Limite SO2: 210 mg/L rossi"],
    notes: "Mercato aperto, alta cultura del vino. Copenagen hub gastronomico. BIO ben posizionato.",
  },
  {
    code: "CA", name: "Canada", flag: "🇨🇦", eu: false,
    tariff: "0% (CETA applicato provvisoriamente)", vat: "5% (GST) + provinciale", excise: "Varia per provincia",
    labeling: "Etichetta bilingue (inglese/francese) obbligatoria",
    certifications: "Licenza CBSA, registrazione provinciali",
    docRequired: ["Certificato di origine CETA", "Licenza SFCA", "Fattura commerciale"],
    restrictions: ["Monopoli provinciali (LCBO, SAQ) per retail", "Etichetta bilingue obbligatoria"],
    notes: "CETA elimina dazi. LCBO e SAQ sono monopoli chiave. Provincie con regole diverse. BIO e premium richiesti.",
  },
  {
    code: "AU", name: "Australia", flag: "🇦🇺", eu: false,
    tariff: "0% (FTA UE-Australia, dal 2022)", vat: "10% (GST)", excise: "A$2.27/L (indice rivalutazione)",
    labeling: "Etichetta in inglese: nome, volume, alcol, allergeni, lotto, importatore",
    certifications: "Licenza Wine Australia, analisi conformita",
    docRequired: ["Certificato di origine", "Licenza importatore", "Dichiarazione Wine Australia"],
    restrictions: ["Limite SO2: 250 mg/L rossi", "Requisiti etichetta standard vino (Wine Australia)"],
    notes: "FTA recente elimina dazi. Mercato competitive ma premium italiano crescente. Importatore locale essenziale.",
  },
  {
    code: "CN", name: "Cina", flag: "🇨🇳", eu: false,
    tariff: "14% (generale,关税)", vat: "13%", excise: "10% (consumption tax)",
    labeling: "Etichetta in cinese: nome, ingredienti, gradazione, importatore, lotto, data produzione",
    certifications: "Certificato sanitario, analisi laboratorio cinese riconosciuto",
    docRequired: ["Certificato di origine", "Certificato sanitario GACC", "Etichetta pre-approvata"],
    restrictions: ["Dazi anti-dumping su vini australiani (non italiani)", "Approval etichetta da GACC pre-arrivo", "Limite SO2: 250 mg/L"],
    notes: "Mercato grande ma complesso. Registrazione GACC obbligatoria per importatore e prodotto. Tempi lunghi (3-6 mesi).",
  },
  {
    code: "KR", name: "Corea del Sud", flag: "🇰🇷", eu: false,
    tariff: "15% (generale) o tariffa EPA UE-Corea", vat: "10%", excise: "30% (liquor tax)",
    labeling: "Etichetta in coreano: nome, volume, alcol, allergeni, importatore",
    certifications: "Certificato di origine EPA, analisi",
    docRequired: ["Certificato di origine EUR.1", "Certificato sanitario", "Fattura commerciale"],
    restrictions: ["Notifica KFDA pre-arrivo", "Etichetta coreana obbligatoria"],
    notes: "EPA UE-Corea riduce dazi. Mercato crescente per vino italiano. Hallyu (onda coreana) aumenta interesse per prodotti premium.",
  },
  {
    code: "BR", name: "Brasile", flag: "🇧🇷", eu: false,
    tariff: "27% (Mercosur, in discussione)", vat: "18% (ICMS, varia stato)", excise: "IPI varia",
    labeling: "Etichetta in portoghese: nome, volume, alcol, allergeni, importatore",
    certifications: "Licenza importatore MAPA, analisi laboratorio",
    docRequired: ["Certificato di origine", "Certificato fitosanitario", "Licenza importazione MAPA"],
    restrictions: ["Licenza di importazione (LI) obbligatoria", "Analisi laboratorio INMETRO", "Limite SO2: 350 mg/L"],
    notes: "Mercato emergente, dazi alti. Accordo Mercosur-UE in discussione. Focus su premium e Metodo Classico.",
  },
  {
    code: "IN", name: "India", flag: "🇮🇳", eu: false,
    tariff: "150% (basic customs duty)", vat: "Varia stato (12-20%)", excise: "Varia stato",
    labeling: "Etichetta in inglese o lingua stato: nome, volume, alcol, allergeni",
    certifications: "Licenza FSSAI, analisi",
    docRequired: ["Certificato di origine", "Licenza FSSAI importatore", "Fattura commerciale"],
    restrictions: ["Dazi altissimi (150%)", "Licenza FSSAI obbligatoria", "Divieto in alcuni stati"],
    notes: "Mercato difficile per dazi altissimi ma potenziale enorme. Focus su segmento ultra-premium in metropoli.",
  },
  {
    code: "SG", name: "Singapore", flag: "🇸🇬", eu: false,
    tariff: "0% (porto franco)", vat: "9% (GST)", excise: "S$88/L (vino fermo)",
    labeling: "Etichetta in inglese: nome, volume, alcol, allergeni, importatore",
    certifications: "Licenza SFA, analisi",
    docRequired: ["Certificato di origine", "Licenza SFA", "Fattura commerciale"],
    restrictions: ["Excise alto", "Permessi SFA per ogni spedizione"],
    notes: "Hub Asiatico, dazi 0% ma excise alta. Punto di accesso per Sud-Est Asiatico. Premium e luxury richiesti.",
  },
  {
    code: "AE", name: "Emirati Arabi Uniti", flag: "🇦🇪", eu: false,
    tariff: "5% (GCC)", vat: "5%", excise: "50% (energy/sugar drinks, non vino)",
    labeling: "Etichetta in inglese/arabo: nome, volume, alcol, allergeni",
    certifications: "Licenza importatore (emirato-specifica)",
    docRequired: ["Certificato di origine", "Licenza importazione", "Fattura commerciale"],
    restrictions: ["Vendita solo in locali con licenza (hotel, club)", "Importazione solo via Dubai/Abu Dhabi", "Etichetta senza immagini proibite"],
    notes: "Mercato luxury turistico. Solo hotel/restaurant con licenza. Dubai hub per re-export GCC.",
  },
  {
    code: "NO", name: "Norvegia", flag: "🇳🇴", eu: false,
    tariff: "Varia (EEA, tariffa libera per vino)", vat: "25%", excise: "NOK 75.77/L (vino fermo >8.5%)",
    labeling: "Etichetta in norvegese: nome, volume, alcol, allergeni, lotto",
    certifications: "Approvazione Vinmonopolet",
    docRequired: ["Certificato di origine", "Registrazione Vinmonopolet"],
    restrictions: ["Monopolio statale: solo Vinmonopolet per retail", "Test panel obbligatorio"],
    notes: "Mercato monopolio come Svezia. Premium e BIO molto richiesti. Excise alta ma mercato sofisticato.",
  },
  {
    code: "IE", name: "Irlanda", flag: "🇮🇪", eu: true,
    tariff: "0% (intracomunitario)", vat: "23%", excise: "€4.18/bt (vino fermo 750ml)",
    labeling: "Etichetta in inglese/irlandese",
    certifications: "Non obbligatorie",
    docRequired: ["Documento EMCS", "Certificato di origine"],
    restrictions: ["Excise alta", "Limite SO2: 210 mg/L rossi"],
    notes: "Mercato piccolo ma in crescita. Excise tra le piu alte d'Europa. BIO e sostenibilita apprezzati.",
  },
];

export default function ExportLegal() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "eu" | "extra">("all");

  const filtered = countries.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "eu" && c.eu) || (filter === "extra" && !c.eu);
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs tracking-[0.25em] uppercase text-gold-600">Export</p>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-bordeaux-50 border border-bordeaux-200 text-bordeaux-600">
              <Scale className="w-3 h-3" /> Normativa
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">Sezione Legale — Paese per Paese</h1>
          <p className="text-sm text-bordeaux-600 leading-relaxed max-w-2xl">
            Guida rapida a dazi, IVA, accise, etichettatura, certificazioni e documentazione richiesta per l'export di vino
            dell'Oltrepò Pavese nei principali mercati. Dati demo — verificare sempre con un consulente doganale locale.
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bordeaux-400" />
            <input
              type="text"
              placeholder="Cerca paese..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>
          <div className="inline-flex rounded-xl bg-cream-200 p-1">
            <button onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-700 hover:text-bordeaux-900"}`}>
              Tutti ({countries.length})
            </button>
            <button onClick={() => setFilter("eu")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "eu" ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-700 hover:text-bordeaux-900"}`}>
              <Globe2 className="w-3.5 h-3.5 inline mr-1" /> UE
            </button>
            <button onClick={() => setFilter("extra")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "extra" ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-700 hover:text-bordeaux-900"}`}>
              Extra-UE
            </button>
          </div>
        </div>

        {/* Country list */}
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.code} className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden hover:border-gold-300 transition-colors">
              <button
                onClick={() => setExpanded(expanded === c.code ? null : c.code)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <h3 className="font-serif text-lg text-bordeaux-950">{c.name}</h3>
                    <p className="text-xs text-bordeaux-500">
                      {c.code} · {c.eu ? "UE" : "Extra-UE"} · Dazio: {c.tariff}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.eu ? "bg-green-100 text-green-700 border border-green-200" : "bg-amber-100 text-amber-700 border border-amber-200"}`}>
                    {c.eu ? "UE" : "Extra-UE"}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-bordeaux-400 transition-transform ${expanded === c.code ? "rotate-180" : ""}`} />
                </div>
              </button>

              {expanded === c.code && (
                <div className="border-t border-cream-200 p-5 space-y-4 animate-fade-in">
                  {/* Tax summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-100">
                      <p className="text-[10px] uppercase tracking-wider text-bordeaux-400 mb-1">Dazio</p>
                      <p className="text-sm font-medium text-bordeaux-800">{c.tariff}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-100">
                      <p className="text-[10px] uppercase tracking-wider text-bordeaux-400 mb-1">IVA</p>
                      <p className="text-sm font-medium text-bordeaux-800">{c.vat}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-100">
                      <p className="text-[10px] uppercase tracking-wider text-bordeaux-400 mb-1">Accisa</p>
                      <p className="text-sm font-medium text-bordeaux-800">{c.excise}</p>
                    </div>
                  </div>

                  {/* Labeling */}
                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Etichettatura
                    </p>
                    <p className="text-sm text-bordeaux-700 leading-relaxed">{c.labeling}</p>
                  </div>

                  {/* Certifications */}
                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Certificazioni
                    </p>
                    <p className="text-sm text-bordeaux-700 leading-relaxed">{c.certifications}</p>
                  </div>

                  {/* Required docs */}
                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">Documentazione richiesta</p>
                    <div className="flex flex-wrap gap-2">
                      {c.docRequired.map((doc, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-cream-100 border border-cream-300 text-bordeaux-700">
                          <FileText className="w-3 h-3" /> {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Restrictions */}
                  <div>
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Restrizioni e limiti
                    </p>
                    <ul className="space-y-1">
                      {c.restrictions.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-bordeaux-700">
                          <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes */}
                  <div className="p-3 rounded-lg bg-gold-50 border border-gold-200">
                    <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider mb-1">Note strategiche</p>
                    <p className="text-sm text-bordeaux-800 leading-relaxed">{c.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-bordeaux-400">Nessun paese trovato per "{search}"</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-cream-200 border border-cream-300">
          <p className="text-xs text-bordeaux-500 leading-relaxed">
            <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
            I dati mostrati sono a scopo dimostrativo e possono non essere aggiornati. Verificare sempre
            con un consulente doganale, l'ICE-Agency e le autorita del paese di destinazione prima di
            procedere con operazioni di export.
          </p>
        </div>
      </div>
    </div>
  );
}
