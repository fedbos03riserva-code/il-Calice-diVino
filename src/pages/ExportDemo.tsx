import { useState } from "react";
import { Printer, FileText, Building2, MapPin, Globe, Wine, Check, Edit3 } from "lucide-react";

const demoData = {
  azienda: "B&F 45 Export Hub",
  territorio: "Oltrepò Pavese, Lombardia",
  contatto: "export@bf45.it",
  telefono: "+39 0383 000000",
  data: "18 Settembre 2026",
  fiera: "ProWein 2026 — Düsseldorf",
  padiglione: "Hall 7A, Stand B12",
  cantine: [
    { nome: "Conte Vistarino", tipo: "Pinot Nero DOC / Metodo Classico DOCG", ettari: 250, moq: 1200, fob: "€8.50/bt", incoterms: "FOB Pavia", certificazioni: ["BIO", "ISO 22000"], paesi: ["DE", "JP", "USA"] },
    { nome: "Tenuta Mazzolino", tipo: "Chardonnay DOC / Metodo Classico", ettari: 180, moq: 800, fob: "€9.20/bt", incoterms: "FOB Pavia", certificazioni: ["BIO"], paesi: ["DE", "CH"] },
    { nome: "Cantine Giorgi", tipo: "Bonarda DOC / Barbera DOC", ettari: 320, moq: 2400, fob: "€4.80/bt", incoterms: "FOB Pavia", certificazioni: ["BRC", "IFS"], paesi: ["DE", "FR", "UK"] },
    { nome: "Vercesi del Castellazzo", tipo: "Riesling DOC / Buttafuoco DOC", ettari: 95, moq: 600, fob: "€7.40/bt", incoterms: "FOB Pavia", certificazioni: ["BIO", "Vegan"], paesi: ["DE", "JP"] },
    { nome: "Ca' di Frara", tipo: "Moscato DOC / Metodo Classico", ettari: 140, moq: 1000, fob: "€6.90/bt", incoterms: "FOB Pavia", certificazioni: ["BIO"], paesi: ["JP", "USA"] },
  ],
  statistiche: [
    { num: "65%", label: "Pinot Nero d'Italia" },
    { num: "7", label: "DOC / DOCG" },
    { num: "12", label: "Cantine export-ready" },
    { num: "225+", label: "Vini catalogati" },
  ],
  puntiForza: [
    "Unica DOCG italiana a base di Pinot Nero (min. 70%)",
    "Tradizione spumantistica dal 1850 (Conte Vistarino)",
    "Riesling Renano DOC — l'unico d'Italia",
    "Buttafuoco Storico: disciplinare del 1907, uno dei piu antichi d'Italia",
    "Ughetta di Canneto: vitigno rarissimo, meno di 200 ettari al mondo",
    "Suoli calcarei marnosi pliocenici, pH 7.5-8.0, simili alla Borgogna",
    "Escursioni termiche 15-20°C: acidita e aromi eleganti",
    "Export in 15+ paesi: DE, JP, USA, UK, CH, FR, NL, BE, SE, DK, CA, AU",
  ],
};

export default function ExportDemo() {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState(demoData);

  const handlePrint = () => window.print();

  const updateField = (field: string, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Export · Demo Precompilato
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950">Documento Fiera — Demo</h1>
            <p className="text-sm text-bordeaux-600 mt-2">Documento precompilato pronto da stampare o salvare come PDF per fiere, eventi e incontri buyer.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-cream-200 text-bordeaux-700 text-sm font-medium hover:bg-cream-300 transition-colors">
              <Edit3 className="w-4 h-4" /> {editing ? "Fine modifica" : "Modifica"}
            </button>
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 text-sm font-medium hover:bg-bordeaux-700 transition-colors">
              <Printer className="w-4 h-4" /> Stampa / PDF
            </button>
          </div>
        </div>

        {/* Printable document */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-lg p-8 md:p-12 print-document">
          {/* Header */}
          <div className="border-b-2 border-bordeaux-800 pb-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wine className="w-8 h-8 text-bordeaux-800" />
                  <span className="font-serif text-2xl font-bold text-bordeaux-950">B&F 45</span>
                </div>
                <p className="text-xs text-bordeaux-500 uppercase tracking-wider">Oltrepò Pavese Wine Export Hub</p>
              </div>
              <div className="text-right text-xs text-bordeaux-600">
                {editing ? (
                  <input type="text" value={data.data} onChange={(e) => updateField("data", e.target.value)} className="border-b border-cream-300 bg-transparent text-right" />
                ) : (
                  <p>{data.data}</p>
                )}
                {editing ? (
                  <input type="text" value={data.fiera} onChange={(e) => updateField("fiera", e.target.value)} className="block mt-1 border-b border-cream-300 bg-transparent text-right font-semibold" />
                ) : (
                  <p className="font-semibold text-bordeaux-800">{data.fiera}</p>
                )}
                {editing ? (
                  <input type="text" value={data.padiglione} onChange={(e) => updateField("padiglione", e.target.value)} className="block mt-1 border-b border-cream-300 bg-transparent text-right" />
                ) : (
                  <p className="mt-1">{data.padiglione}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {data.statistiche.map((s, i) => (
              <div key={i} className="text-center p-3 rounded-lg bg-cream-50 border border-cream-200">
                <p className="font-serif text-2xl text-bordeaux-800">{s.num}</p>
                <p className="text-[10px] text-bordeaux-500 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Territory */}
          <div className="mb-8">
            <h2 className="font-serif text-xl text-bordeaux-950 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold-600" /> Territorio
            </h2>
            <p className="text-sm text-bordeaux-700 leading-relaxed">
              {data.territorio}. Colline calcaree a sud del fiume Po, 150-500 m slm.
              Suoli marnosi pliocenici pH 7.5-8.0, clima continentale con escursioni termiche 15-20°C.
              Tradizione vitivinicola dal 1850. Capitale italiana del Pinot Nero e del Metodo Classico.
            </p>
          </div>

          {/* Strengths */}
          <div className="mb-8">
            <h2 className="font-serif text-xl text-bordeaux-950 mb-3">Punti di Forza</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.puntiForza.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-bordeaux-700">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wineries table */}
          <div className="mb-8">
            <h2 className="font-serif text-xl text-bordeaux-950 mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gold-600" /> Cantine Export-Ready
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-bordeaux-800 text-cream-50">
                    <th className="text-left px-3 py-2 font-semibold">Cantina</th>
                    <th className="text-left px-3 py-2 font-semibold">Tipologia</th>
                    <th className="text-right px-3 py-2 font-semibold">Ettari</th>
                    <th className="text-right px-3 py-2 font-semibold">MOQ (bt)</th>
                    <th className="text-right px-3 py-2 font-semibold">FOB</th>
                    <th className="text-left px-3 py-2 font-semibold">Incoterms</th>
                    <th className="text-left px-3 py-2 font-semibold">Cert.</th>
                    <th className="text-left px-3 py-2 font-semibold">Paesi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cantine.map((c, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-cream-50" : "bg-white"}>
                      <td className="px-3 py-2 font-medium text-bordeaux-950">{c.nome}</td>
                      <td className="px-3 py-2 text-bordeaux-600">{c.tipo}</td>
                      <td className="px-3 py-2 text-right text-bordeaux-600">{c.ettari}</td>
                      <td className="px-3 py-2 text-right text-bordeaux-600">{c.moq.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right text-bordeaux-600">{c.fob}</td>
                      <td className="px-3 py-2 text-bordeaux-600">{c.incoterms}</td>
                      <td className="px-3 py-2 text-bordeaux-600">{c.certificazioni.join(", ")}</td>
                      <td className="px-3 py-2 text-bordeaux-600">{c.paesi.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t-2 border-bordeaux-800 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-bordeaux-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Email</p>
                {editing ? (
                  <input type="text" value={data.contatto} onChange={(e) => updateField("contatto", e.target.value)} className="border-b border-cream-300 bg-transparent w-full" />
                ) : (
                  <p className="text-bordeaux-700 font-medium">{data.contatto}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-bordeaux-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Telefono</p>
                {editing ? (
                  <input type="text" value={data.telefono} onChange={(e) => updateField("telefono", e.target.value)} className="border-b border-cream-300 bg-transparent w-full" />
                ) : (
                  <p className="text-bordeaux-700 font-medium">{data.telefono}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-bordeaux-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Sede</p>
                <p className="text-bordeaux-700 font-medium">{data.territorio}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-bordeaux-400">
            <p>Documento generato da B&F 45 Export Hub · {data.data} · Demo precompilato</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Phone({ className }: { className?: string }) {
  return <span className={className}>tel:</span>;
}
