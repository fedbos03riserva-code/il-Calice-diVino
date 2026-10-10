#!/usr/bin/env python3
"""Genera il PDF delle LINEE GUIDA — versione professionale concisa."""

from fpdf import FPDF
import re
import os

BORDEAUX = (107, 20, 38)
BORDEAUX_DARK = (66, 12, 24)
GOLD = (184, 148, 50)
CREAM = (252, 247, 237)
CREAM_LIGHT = (253, 250, 244)
TEXT_BODY = (60, 45, 40)

DEJA = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DEJA_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
DEJA_S = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
DEJA_SB = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

PDF_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "LINEE_GUIDA_BF45.pdf")


class BF45PDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_fill_color(*BORDEAUX_DARK)
        self.rect(0, 0, self.w, 18, "F")
        self.set_font("DejaVu", "B", 7.5)
        self.set_text_color(*CREAM)
        self.set_xy(20, 6)
        self.cell(0, 6, "B&F 45 — Linee Guida", align="L")
        self.set_font("DejaVu", "", 7.5)
        self.set_text_color(*GOLD)
        self.cell(0, 6, f"Pag. {self.page_no()}", align="R", new_x="LMARGIN")
        self.set_y(18)
        self.ln(3)

    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-14)
        self.set_draw_color(*GOLD)
        self.set_line_width(0.3)
        self.line(20, self.get_y(), self.w - 20, self.get_y())
        self.set_y(-10)
        self.set_font("DejaVu", "", 7)
        self.set_text_color(*GOLD)
        self.cell(0, 6, "B&F 45 — Oltrepò Pavese, Lombardia | bf45.bolt.app", align="C")


# Only the most essential sections — concise and professional
SECTIONS = [
    {
        "title": "Accesso Admin",
        "items": [
            "Menu Altro > Admin. Password: bf45-admin (cambiarla in src/pages/Admin.tsx).",
            "Pannelli: Panoramica, Ordini, Candidature, Recensioni, Ricerche, Catalogo, AI Engine.",
        ],
    },
    {
        "title": "Codici AI",
        "items": [
            "BF45PROVA: 100 usi, 50/giorno (trial). BF45PRO: 10000 usi, 100/giorno (PRO, Sonnet 4).",
            "Tabella Supabase ai_access_codes. Creare nuovi codici via SQL o Table Editor.",
            "Il limite giornaliero si resetta 24h dopo il primo uso. Superato il limite, fallback automatico al motore locale.",
        ],
    },
    {
        "title": "Database",
        "items": [
            "rfq_requests: richieste di preventivo buyer-cantine.",
            "winery_qr_data: dati dinamici QR cantine.",
            "ai_access_codes: codici AI con limiti totali e giornalieri.",
            "work_with_us: candidature dal form Lavora con noi.",
            "wine_reviews: recensioni utenti sui vini (rating 1-5).",
            "platform_users: registrazioni utente pronte per il lancio.",
            "saved_wines: vini salvati/bookmarkati dagli utenti.",
        ],
    },
    {
        "title": "Edge Functions",
        "items": [
            "ai-pairing: abbinamento molecolare cibo-vino (Claude). Rate limiting 10 req/min per IP.",
            "ai-winery-match: matching buyer-cantine per export (Claude Haiku, 8 criteri).",
            "analytics-stats: statistiche anonime per dashboard.",
            "ai-chem-explain: spiegazione chimica approfondita abbinamento.",
            "ai-climate-oltrepo: analisi climatica territorio Oltrepò.",
        ],
    },
    {
        "title": "Menu di Navigazione",
        "items": [
            "Privati: Home, Abbinamenti, Quiz, Wine Lab, Reverse Pairing, Premium.",
            "Export: B2B, Directory Cantine, Mappa, RFQ, Export Process, Export Legale, Materiali B2B.",
            "Ristorante: Dashboard, Analytics, QR Menu, QR Cantina.",
            "Cantina: Gestione Vini, QR Panel, Premium Cantina.",
            "Altro: Chi siamo, Lavora con noi, Business Plan, Admin, Documenti.",
        ],
    },
    {
        "title": "Lingue Supportate",
        "items": ["7 lingue: IT, EN, FR, ES, DE, JP, NL. File: src/i18n/translations.ts"],
    },
    {
        "title": "AI Base vs PRO",
        "items": [
            "Base (Haiku): 4000 token, 60 vini, 3-4 righe perche, 3-6 molecole.",
            "PRO (Sonnet 4): 6000 token, 30 vini, 2 discorsi narrativi, reazione digestiva, 4-8 molecole, temperatura servizio, tempo decantazione.",
            "Il tasto PRO e sempre visibile. La scelta persiste in localStorage.",
        ],
    },
    {
        "title": "Tecnologia",
        "items": [
            "Frontend: React + TypeScript + Vite. Backend: Supabase (PostgreSQL, RLS, Edge Functions Deno).",
            "AI: Claude (Anthropic). Motore locale sempre disponibile come fallback.",
            "Mappe: Leaflet.js. Stile: Tailwind CSS 4, palette bordeaux/oro/crema.",
        ],
    },
    {
        "title": "Glossario Export",
        "items": [
            "RFQ: Request for Quote — richiesta di preventivo formale.",
            "MOQ: Minimum Order Quantity — quantita minima ordinabile.",
            "FOB: Free On Board — prezzo merce caricata sul mezzo di trasporto.",
            "CIF: Cost, Insurance and Freight — prezzo con trasporto e assicurazione inclusi.",
            "DDP: Delivered Duty Paid — venditore paga tutto incluso dazi.",
            "HS Code: codice tariffario internazionale (vino: 2204.21).",
            "BRC/IFS: standard sicurezza alimentare per GDO europea.",
            "BIO/ORGANIC: vino biologico certificato. BIODYNAMIC: certificato Demeter/Biodyvin.",
            "LCL/FCL: spedizione marittima condivisa / container intero.",
            "BL: Bill of Lading — polizza di carico marittima.",
        ],
    },
    {
        "title": "Glossario Vino",
        "items": [
            "DOC: Denominazione di Origine Controllata. DOCG: livello superiore con garanzia.",
            "IGT: Indicazione Geografica Tipica — regole piu flessibili.",
            "7 DOC/DOCG Oltrepò: Metodo Classico DOCG, Pinot Nero, Bonarda, Buttafuoco, Sangue di Giuda, Barbera, Riesling.",
            "IRC: Indice di Reattivita Chimica — punteggio 0-100 (Chimica 40 + Aromatico 25 + Struttura 20 + Pulizia 15).",
        ],
    },
]


def main():
    pdf = BF45PDF(orientation="P", format="A4")
    pdf.set_auto_page_break(auto=True, margin=22)
    pdf.set_margins(20, 24, 20)
    pdf.add_font("DejaVu", "", DEJA)
    pdf.add_font("DejaVu", "B", DEJA_B)
    pdf.add_font("DejaVuSerif", "", DEJA_S)
    pdf.add_font("DejaVuSerif", "B", DEJA_SB)

    # ── Title page ──
    pdf.add_page()
    pdf.set_fill_color(*BORDEAUX_DARK)
    pdf.rect(0, 0, pdf.w, pdf.h, "F")

    pdf.set_y(60)
    pdf.set_font("DejaVuSerif", "B", 26)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 12, "B&F 45", align="C", new_x="LMARGIN")
    pdf.ln(5)
    pdf.set_font("DejaVu", "B", 11)
    pdf.set_text_color(*CREAM)
    pdf.cell(0, 7, "LINEE GUIDA DELLA PIATTAFORMA", align="C", new_x="LMARGIN")
    pdf.ln(6)
    pdf.set_draw_color(*GOLD)
    pdf.set_line_width(0.4)
    x_start = 70
    pdf.line(x_start, pdf.get_y(), pdf.w - x_start, pdf.get_y())
    pdf.ln(8)
    pdf.set_font("DejaVu", "", 9)
    pdf.set_text_color(*CREAM)
    pdf.cell(0, 5, "Riferimento operativo per la gestione", align="C", new_x="LMARGIN")
    pdf.ln(20)
    pdf.set_font("DejaVu", "", 8)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 5, "Oltrepò Pavese, Lombardia | bf45.bolt.app", align="C", new_x="LMARGIN")

    # ── Content pages ──
    pdf.add_page()
    pdf.set_fill_color(*CREAM_LIGHT)
    pdf.rect(0, 18, pdf.w, pdf.h - 36, "F")

    for section in SECTIONS:
        # Section header
        pdf.ln(4)
        pdf.set_fill_color(*BORDEAUX)
        pdf.set_font("DejaVu", "B", 10)
        pdf.set_text_color(*CREAM)
        pdf.set_x(20)
        pdf.cell(0, 7, section["title"], fill=True, new_x="LMARGIN")
        pdf.ln(4)

        for item in section["items"]:
            pdf.set_font("DejaVu", "", 8)
            pdf.set_text_color(*TEXT_BODY)
            pdf.set_x(24)
            pdf.multi_cell(0, 4.2, f"•  {item}")
            pdf.ln(0.5)

    pdf.output(PDF_PATH)
    print(f"PDF generato: {os.path.abspath(PDF_PATH)}")
    print(f"Dimensione: {os.path.getsize(PDF_PATH)} bytes")


if __name__ == "__main__":
    main()
