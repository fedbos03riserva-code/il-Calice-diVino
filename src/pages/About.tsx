import { Mail, MapPin, Phone, GraduationCap, Leaf, Cpu, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function About() {
  const { t } = useApp();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Chi siamo */}
      <section className="mb-14">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-600 mb-3">Chi siamo</p>
        <h1 className="font-serif text-4xl md:text-5xl text-bordeaux-950">B&F 45</h1>
        <p className="text-bordeaux-600 mt-4 text-lg leading-relaxed">
          B&F 45 unisce la scienza del gusto alla tradizione enologica: un motore di abbinamento molecolare che analizza acidità, tannini, struttura e profilo aromatico per consigliarti il vino perfetto per ogni piatto.
        </p>
      </section>

      {/* Il progetto */}
      <section className="mb-14 p-6 rounded-2xl bg-cream-100 border border-cream-200">
        <h2 className="font-serif text-2xl text-bordeaux-950 mb-3">Il progetto</h2>
        <p className="text-sm text-bordeaux-600 leading-relaxed">
          B&F 45 nasce dall'idea che ogni abbinamento vino-cibo non sia questione di gusto personale, ma di chimica del gusto.
          Il nostro motore IRC valuta ogni vino su quattro dimensioni — chimica, aromaticità, struttura e pulizia del palato —
          e ti restituisce un punteggio oggettivo da 0 a 100. Che tu sia un appassionato, un ristoratore o un privato curioso,
          B&F 45 ti aiuta a scegliere e valorizzare ogni calice.
        </p>
      </section>

      {/* Il fondatore */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <GraduationCap className="w-7 h-7 text-gold-600" />
          <h2 className="font-serif text-2xl text-bordeaux-950">Il fondatore</h2>
        </div>
        <div className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100">
          <h3 className="font-serif text-xl text-cream-50">Federico Bosoni</h3>
          <p className="text-sm text-gold-400 mt-1">Studente di Ingegneria per l'Ambiente e il Territorio — Politecnico di Milano</p>
          <div className="mt-4 space-y-3 text-sm text-cream-200 leading-relaxed">
            <p>
              Competenze in modellistica e simulazione, gestione delle risorse idriche, geotecnica, analisi dei suoli,
              valutazione di impatto ambientale e gestione sostenibile dei processi produttivi.
            </p>
            <p>
              Appassionato di innovazione tecnologica, intelligenza artificiale e automazione, con particolare interesse
              per l'agricoltura e l'agritech.
            </p>
            <p>
              Motivato a sviluppare soluzioni digitali e sostenibili per ottimizzare i processi produttivi e valorizzare
              il territorio, unendo tradizione e innovazione.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="flex items-center gap-1.5 text-xs text-cream-300 bg-bordeaux-800/50 px-3 py-1.5 rounded-full"><Leaf className="w-3.5 h-3.5 text-gold-400" /> Sostenibilità</span>
            <span className="flex items-center gap-1.5 text-xs text-cream-300 bg-bordeaux-800/50 px-3 py-1.5 rounded-full"><Cpu className="w-3.5 h-3.5 text-gold-400" /> AI & Automazione</span>
            <span className="flex items-center gap-1.5 text-xs text-cream-300 bg-bordeaux-800/50 px-3 py-1.5 rounded-full"><GraduationCap className="w-3.5 h-3.5 text-gold-400" /> Ingegneria ambientale</span>
          </div>
        </div>
      </section>

      {/* Contatti */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-bordeaux-950 mb-5">Contatti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-cream-100 border border-cream-200">
            <Mail className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-500">Email</p>
            <p className="text-sm text-bordeaux-950 mt-1">info@bf45.it</p>
          </div>
          <div className="p-5 rounded-xl bg-cream-100 border border-cream-200">
            <Phone className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-500">Telefono</p>
            <p className="text-sm text-bordeaux-950 mt-1">+39 02 1234 5678</p>
          </div>
          <div className="p-5 rounded-xl bg-cream-100 border border-cream-200">
            <MapPin className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-500">Sede</p>
            <p className="text-sm text-bordeaux-950 mt-1">Milano, Italia</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <button
          onClick={() => window.location.hash = ""}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors"
        >
          {t("nav.home")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
