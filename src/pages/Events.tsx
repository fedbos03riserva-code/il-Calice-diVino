import { useState } from "react";
import { Calendar, MapPin, Users, Ticket, Wine, Store, Check, Sparkles, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

interface WineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: string;
  free: boolean;
  image: string;
  producers: string[];
  seats: number;
  seatsLeft: number;
  example: boolean;
}

const EVENTS: WineEvent[] = [
  {
    id: "evt1",
    title: "Degustazione guidata: Bonarda e Buttafuoco dell'Oltrepò",
    date: "2026-10-12",
    time: "18:30",
    location: "Canneto Pavese (PV)",
    description: "Serata di degustazione guidata alla scoperta dei vini storici dell'Oltrepò Pavese. Un percorso tra Bonarda, Buttafuoco Storico e Sangue di Giuda, con abbinamenti a cura del motore IRC. Condotta da un sommelier del territorio, la serata include 8 vini in degustazione e un tagliere di salumi e formaggi locali.",
    price: "€ 25",
    free: false,
    image: "degustazione-bonarda-buttafuoco",
    producers: ["Cantine Giorgi", "Monsupello", "Vercesi del Castellazzo", "Ballabio"],
    seats: 40,
    seatsLeft: 12,
    example: true,
  },
  {
    id: "evt2",
    title: "Cena abbinata Carta Viva presso Osteria della Colombara",
    date: "2026-10-26",
    time: "20:00",
    location: "Stradella (PV)",
    description: "Cena di cinque portate con abbinamenti wine pairing calcolati dal motore IRC di B&F 45. Ogni piatto del menù stagionale viene presentato con due vini dell'Oltrepò Pavese selezionati dall'AI per l'abbinamento perfetto. Menù: antipasto di salumi pavesi, agnolotti del plin, stracotto d'asino, formaggi stagionati e dessert al Sangue di Giuda.",
    price: "€ 65",
    free: false,
    image: "cena-carta-viva-colombara",
    producers: ["Tenuta Mazzolino", "Conte Vistarino", "Frecciarossa", "Ca' di Frara"],
    seats: 30,
    seatsLeft: 8,
    example: true,
  },
  {
    id: "evt3",
    title: "Fiera export Oltrepò Pavese: incontro cantine e buyer internazionali",
    date: "2026-11-15",
    time: "10:00",
    location: "Casteggio (PV)",
    description: "Giornata dedicata all'export: 15 cantine dell'Oltrepò Pavese incontrano buyer europei e nordamericani. Presentazioni tecniche sui vitigni autoctoni (Croatina, Uva Rara, Ughetta), tavola rotonda sul futuro del Metodo Classico DOCG e sessioni di degustazione B2B. Apertura al pubblico nel pomeriggio con stand di degustazione.",
    price: "Ingresso libero",
    free: true,
    image: "fiera-export-oltrepo-pavese",
    producers: ["Cantine Giorgi", "Doria", "Travaglino", "Le Fracce", "Andrea Picchioni"],
    seats: 200,
    seatsLeft: 145,
    example: true,
  },
];

export default function Events() {
  const { t } = useApp();
  const [bookingEvent, setBookingEvent] = useState<WineEvent | null>(null);
  const [bookingForm, setBookingForm] = useState({ nome: "", email: "", persone: 1 });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [organizerForm, setOrganizerForm] = useState({ nome: "", email: "", tipo: "", locale: "", descrizione: "" });
  const [organizerSent, setOrganizerSent] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const handleOrganizer = (e: React.FormEvent) => {
    e.preventDefault();
    setOrganizerSent(true);
  };

  const closeBooking = () => {
    setBookingEvent(null);
    setBookingConfirmed(false);
    setBookingForm({ nome: "", email: "", persone: 1 });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400";
  const labelClass = "text-xs text-bordeaux-600 block mb-1";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-bordeaux-800 flex items-center justify-center">
          <Calendar className="w-7 h-7 text-gold-400" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950">{t("events.title")}</h1>
        <p className="text-bordeaux-600 mt-2 max-w-2xl mx-auto">{t("events.subtitle")}</p>
      </div>

      {/* Event cards */}
      <div className="space-y-6 mb-12">
        {EVENTS.map((evt) => (
          <div key={evt.id} className="overflow-hidden rounded-2xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors">
            <div className="flex flex-col md:flex-row">
              {/* Image / visual */}
              <div className="md:w-2/5 lg:w-1/3 shrink-0 relative bg-gradient-to-br from-bordeaux-800 to-bordeaux-950 min-h-[180px] flex items-center justify-center p-6">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(200,157,46,0.4) 0%, transparent 50%)" }} />
                <div className="relative text-center">
                  <Wine className="w-12 h-12 text-gold-400 mx-auto mb-2" />
                  <p className="text-xs text-gold-400 uppercase tracking-wider">{evt.location}</p>
                </div>
                {evt.example && (
                  <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full bg-gold-400 text-bordeaux-950 font-semibold uppercase tracking-wider">
                    {t("events.example")}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-serif text-xl text-bordeaux-950">{evt.title}</h2>
                  <span className={`text-sm font-semibold shrink-0 px-3 py-1 rounded-full ${evt.free ? "bg-green-100 text-green-700" : "bg-gold-100 text-gold-700"}`}>
                    {evt.price}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-bordeaux-600 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold-600" /> {formatDate(evt.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold-600" /> {evt.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold-600" /> {evt.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gold-600" /> {evt.seatsLeft}/{evt.seats} {t("events.seatsLeft")}
                  </span>
                </div>

                <p className="text-sm text-bordeaux-700 leading-relaxed mb-4">{evt.description}</p>

                {/* Producers */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gold-700 mb-1.5">{t("events.producers")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {evt.producers.map((p) => (
                      <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200">{p}</span>
                    ))}
                  </div>
                </div>

                <button onClick={() => setBookingEvent(evt)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors text-sm">
                  <Ticket className="w-4 h-4" /> {t("events.book")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Organize your event */}
      <div className="rounded-2xl bg-bordeaux-950 text-cream-100 p-8 md:p-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gold-400 flex items-center justify-center">
            <Store className="w-6 h-6 text-bordeaux-950" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-cream-50">{t("events.organize.title")}</h2>
            <p className="text-sm text-cream-300">{t("events.organize.subtitle")}</p>
          </div>
        </div>

        {!organizerSent ? (
          <form onSubmit={handleOrganizer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className={labelClass + " text-cream-300"}>{t("events.organizer.name")}</label>
              <input type="text" required value={organizerForm.nome} onChange={(e) => setOrganizerForm({ ...organizerForm, nome: e.target.value })}
                className={inputClass + " bg-bordeaux-900 border-bordeaux-700 text-cream-50"} />
            </div>
            <div>
              <label className={labelClass + " text-cream-300"}>{t("events.organizer.email")}</label>
              <input type="email" required value={organizerForm.email} onChange={(e) => setOrganizerForm({ ...organizerForm, email: e.target.value })}
                className={inputClass + " bg-bordeaux-900 border-bordeaux-700 text-cream-50"} />
            </div>
            <div>
              <label className={labelClass + " text-cream-300"}>{t("events.organizer.type")}</label>
              <select required value={organizerForm.tipo} onChange={(e) => setOrganizerForm({ ...organizerForm, tipo: e.target.value })}
                className={inputClass + " bg-bordeaux-900 border-bordeaux-700 text-cream-50"}>
                <option value="">{t("events.organizer.type.select")}</option>
                <option value="cantine">{t("events.organizer.type.cantine")}</option>
                <option value="ristorante">{t("events.organizer.type.ristorante")}</option>
                <option value="ente">{t("events.organizer.type.ente")}</option>
                <option value="altro">{t("events.organizer.type.altro")}</option>
              </select>
            </div>
            <div>
              <label className={labelClass + " text-cream-300"}>{t("events.organizer.venue")}</label>
              <input type="text" value={organizerForm.locale} onChange={(e) => setOrganizerForm({ ...organizerForm, locale: e.target.value })}
                className={inputClass + " bg-bordeaux-900 border-bordeaux-700 text-cream-50"} placeholder={t("events.organizer.venue.ph")} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass + " text-cream-300"}>{t("events.organizer.desc")}</label>
              <textarea required value={organizerForm.descrizione} onChange={(e) => setOrganizerForm({ ...organizerForm, descrizione: e.target.value })}
                rows={3} className={inputClass + " bg-bordeaux-900 border-bordeaux-700 text-cream-50 resize-none"}
                placeholder={t("events.organizer.desc.ph")} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors">
                <Sparkles className="w-4 h-4" /> {t("events.organizer.submit")}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 p-6 rounded-xl bg-bordeaux-800/50 border border-gold-700/30 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Check className="w-6 h-6 text-gold-400" />
              <h3 className="font-serif text-lg text-cream-50">{t("events.organizer.sent")}</h3>
            </div>
            <p className="text-sm text-cream-300">{t("events.organizer.sent.desc")}</p>
            <button onClick={() => { setOrganizerSent(false); setOrganizerForm({ nome: "", email: "", tipo: "", locale: "", descrizione: "" }); }}
              className="mt-4 text-sm text-gold-400 hover:text-gold-300">
              {t("events.organizer.sendAnother")}
            </button>
          </div>
        )}
      </div>

      {/* Booking modal */}
      {bookingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bordeaux-950/80 backdrop-blur-sm" onClick={closeBooking}>
          <div className="bg-cream-50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {!bookingConfirmed ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-bordeaux-950">{t("events.booking.title")}</h3>
                  <button onClick={closeBooking} className="text-bordeaux-400 hover:text-bordeaux-700 text-2xl leading-none">&times;</button>
                </div>
                <div className="p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200 mb-4">
                  <p className="font-medium text-sm text-bordeaux-950">{bookingEvent.title}</p>
                  <p className="text-xs text-bordeaux-600 mt-1">{formatDate(bookingEvent.date)} · {bookingEvent.time} · {bookingEvent.location}</p>
                  <p className="text-sm font-semibold text-gold-700 mt-1">{bookingEvent.price}</p>
                </div>
                <form onSubmit={handleBooking} className="space-y-3">
                  <div>
                    <label className={labelClass}>{t("events.booking.name")}</label>
                    <input type="text" required value={bookingForm.nome} onChange={(e) => setBookingForm({ ...bookingForm, nome: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("events.booking.email")}</label>
                    <input type="email" required value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("events.booking.people")}</label>
                    <input type="number" min="1" max="10" required value={bookingForm.persone} onChange={(e) => setBookingForm({ ...bookingForm, persone: parseInt(e.target.value) || 1 })} className={inputClass} />
                  </div>
                  {!bookingEvent.free && (
                    <div className="p-3 rounded-lg bg-gold-50 border border-gold-200">
                      <p className="text-xs text-gold-700">{t("events.booking.paymentNote")}</p>
                    </div>
                  )}
                  <button type="submit"
                    className="w-full py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors text-sm">
                    {bookingEvent.free ? t("events.booking.confirmFree") : t("events.booking.confirmPaid")}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif text-xl text-bordeaux-950 mb-2">{t("events.booking.confirmed")}</h3>
                <p className="text-sm text-bordeaux-600 mb-1">{t("events.booking.confirmedDesc")}</p>
                <p className="text-xs text-bordeaux-500 mt-3 mb-4">
                  {bookingEvent.title}<br />
                  {formatDate(bookingEvent.date)} · {bookingEvent.time}<br />
                  {bookingForm.persone} {t("events.booking.peopleLabel")}
                </p>
                <button onClick={closeBooking}
                  className="px-5 py-2.5 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors text-sm">
                  {t("events.booking.close")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
