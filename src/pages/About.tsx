import { Mail, MapPin, Phone, GraduationCap, Leaf, Cpu, ArrowRight, Wine, FlaskConical, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function About() {
  const { t } = useApp();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Hero - Chi siamo */}
      <section className="mb-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-bordeaux-950 via-bordeaux-900 to-bordeaux-800 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(200,157,46,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(155,18,56,0.3) 0%, transparent 40%)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Wine className="w-8 h-8 text-gold-400" />
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Chi siamo</p>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-cream-50">B&F 45</h1>
          <p className="text-cream-200 mt-4 text-lg leading-relaxed max-w-2xl">
            Uniamo la scienza del gusto alla tradizione enologica: un motore di abbinamento molecolare che analizza acidità, tannini, struttura e profilo aromatico per consigliarti il vino perfetto per ogni piatto.
          </p>
        </div>
      </section>

      {/* Il progetto - con card colorate */}
      <section className="mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-cream-100 border border-cream-200">
            <FlaskConical className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">Motore IRC</h3>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">Quattro dimensioni — chimica, aromaticità, struttura e pulizia — per un punteggio oggettivo da 0 a 100.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gold-50 border border-gold-200">
            <Cpu className="w-8 h-8 text-gold-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">AI & Dati</h3>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">Oltre 600 vini analizzati molecularmente, con consulenze AI per ristoratori e privati.</p>
          </div>
          <div className="p-6 rounded-2xl bg-bordeaux-50 border border-bordeaux-200">
            <Globe className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">Dal mondo</h3>
            <p className="text-sm text-bordeaux-600 mt-2 leading-relaxed">Vini da 5 continenti, 30 paesi e oltre 120 regioni, dall'Italia al Cile, dalla Francia al Libano.</p>
          </div>
        </div>
      </section>

      {/* Il fondatore - bio breve */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <GraduationCap className="w-7 h-7 text-gold-600" />
          <h2 className="font-serif text-2xl text-bordeaux-950">Il fondatore</h2>
        </div>
        <div className="p-8 rounded-2xl bg-gradient-to-br from-bordeaux-950 to-bordeaux-800 text-cream-100">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gold-400 flex items-center justify-center">
                <span className="font-serif text-3xl text-bordeaux-950">FB</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-cream-50">Federico Bosoni</h3>
              <p className="text-sm text-gold-400 mt-1">Ingegneria per l'Ambiente e il Territorio — Politecnico di Milano</p>
              <p className="text-sm text-cream-200 mt-4 leading-relaxed">
                Appassionato di vino, intelligenza artificiale e agritech, unisce la precisione della modellistica ambientale
                all'amore per il territorio per costruire soluzioni digitali che valorizzano la tradizione enologica attraverso la scienza.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30"><Wine className="w-3.5 h-3.5 text-gold-400" /> Vino & AI</span>
                <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30"><Leaf className="w-3.5 h-3.5 text-gold-400" /> Sostenibilità</span>
                <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30"><Cpu className="w-3.5 h-3.5 text-gold-400" /> Automazione</span>
                <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30"><GraduationCap className="w-3.5 h-3.5 text-gold-400" /> Agritech</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contatti - card colorate */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-bordeaux-950 mb-5">Contatti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cream-100 to-cream-200 border border-cream-300">
            <Mail className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-500">Email</p>
            <p className="text-sm text-bordeaux-950 mt-1 font-medium">info@bf45.it</p>
            <p className="text-xs text-bordeaux-500 mt-1">Risposta entro 24h</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200">
            <Phone className="w-5 h-5 text-gold-700 mb-2" />
            <p className="text-xs text-gold-600">Telefono</p>
            <p className="text-sm text-bordeaux-950 mt-1 font-medium">+39 02 1234 5678</p>
            <p className="text-xs text-gold-600 mt-1">Lun–Ven 9:00–18:00</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-bordeaux-50 to-bordeaux-100 border border-bordeaux-200">
            <MapPin className="w-5 h-5 text-bordeaux-700 mb-2" />
            <p className="text-xs text-bordeaux-500">Sede</p>
            <p className="text-sm text-bordeaux-950 mt-1 font-medium">Milano, Italia</p>
            <p className="text-xs text-bordeaux-500 mt-1">Politecnico di Milano</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
          {t("nav.home")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
