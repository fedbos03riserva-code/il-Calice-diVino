#!/usr/bin/env python3
"""Genera il PDF delle LINEE GUIDA con i colori della piattaforma B&F 45."""

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
DEJA_O = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DEJA_S = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
DEJA_SB = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

PDF_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "LINEE_GUIDA_BF45.pdf")

class BF45PDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_fill_color(*BORDEAUX_DARK)
        self.rect(0, 0, self.w, 22, "F")
        self.set_font("DejaVu", "B", 8)
        self.set_text_color(*CREAM)
        self.set_xy(20, 7)
        self.cell(0, 8, "B&F 45 — Linee Guida della Piattaforma", align="L")
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*GOLD)
        self.cell(0, 8, f"Pag. {self.page_no()}", align="R", new_x="LMARGIN")
        self.set_y(22)
        self.ln(4)

    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-16)
        self.set_draw_color(*GOLD)
        self.set_line_width(0.3)
        self.line(20, self.get_y(), self.w - 20, self.get_y())
        self.set_y(-12)
        self.set_font("DejaVu", "I", 7)
        self.set_text_color(*GOLD)
        self.cell(0, 8, "B&F 45 — Oltrepò Pavese, Lombardia | bf45.bolt.app", align="C")

def main():
    txt_path = os.path.join(os.path.dirname(__file__), "..", "LINEE_GUIDA.txt")
    with open(txt_path, "r", encoding="utf-8") as f:
        lines = f.read().split("\n")

    pdf = BF45PDF(orientation="P", format="A4")
    pdf.set_auto_page_break(auto=True, margin=25)
    pdf.set_margins(20, 28, 20)
    pdf.add_font("DejaVu", "", DEJA)
    pdf.add_font("DejaVu", "B", DEJA_B)
    pdf.add_font("DejaVu", "I", DEJA_O)
    pdf.add_font("DejaVuSerif", "", DEJA_S)
    pdf.add_font("DejaVuSerif", "B", DEJA_SB)

    # ── Title page ──
    pdf.add_page()
    pdf.set_fill_color(*BORDEAUX_DARK)
    pdf.rect(0, 0, pdf.w, pdf.h, "F")

    pdf.set_y(55)
    pdf.set_font("DejaVuSerif", "B", 28)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 14, "B&F 45", align="C", new_x="LMARGIN")
    pdf.ln(6)
    pdf.set_font("DejaVu", "B", 13)
    pdf.set_text_color(*CREAM)
    pdf.cell(0, 8, "LINEE GUIDA DELLA PIATTAFORMA", align="C", new_x="LMARGIN")
    pdf.ln(8)
    pdf.set_draw_color(*GOLD)
    pdf.set_line_width(0.5)
    x_start = 65
    pdf.line(x_start, pdf.get_y(), pdf.w - x_start, pdf.get_y())
    pdf.ln(10)
    pdf.set_font("DejaVu", "", 10)
    pdf.set_text_color(*CREAM)
    pdf.cell(0, 6, "Documento di riferimento per gestire la piattaforma", align="C", new_x="LMARGIN")
    pdf.ln(4)
    pdf.set_font("DejaVu", "I", 9)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 6, "Ultimo aggiornamento: 18 Settembre 2026 (rev. 2)", align="C", new_x="LMARGIN")

    pdf.ln(25)
    pdf.set_font("DejaVu", "", 9)
    pdf.set_text_color(*CREAM)
    topics = [
        "Accesso Admin e Business Plan",
        "Codici di accesso AI e limiti giornalieri",
        "Tabelle database e Edge Functions",
        "Menu di navigazione e lingue",
        "Modalita AI Base vs PRO",
        "Uso dell'AI nel matching cantine-buyer",
        "Glossario sigle export e commercio",
    ]
    for t in topics:
        pdf.set_x(50)
        pdf.cell(pdf.w - 100, 7, f"-  {t}", align="C", new_x="LMARGIN")

    pdf.ln(25)
    pdf.set_font("DejaVu", "I", 8)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 5, "Oltrepò Pavese, Lombardia | bf45.bolt.app", align="C", new_x="LMARGIN")

    # ── Content pages ──
    pdf.add_page()
    pdf.set_fill_color(*CREAM_LIGHT)
    pdf.rect(0, 22, pdf.w, pdf.h - 40, "F")

    in_glossary = False

    for i, raw_line in enumerate(lines):
        line = raw_line.rstrip()
        stripped = line.strip()

        if i < 6:
            continue
        if not stripped:
            pdf.ln(3)
            continue

        if stripped.startswith("---") and stripped.endswith("---") and len(stripped) > 5:
            title = stripped.replace("---", "").strip()
            pdf.ln(5)
            pdf.set_fill_color(*BORDEAUX)
            pdf.set_font("DejaVu", "B", 11)
            pdf.set_text_color(*CREAM)
            pdf.set_x(20)
            pdf.cell(0, 9, title, fill=True, new_x="LMARGIN")
            pdf.ln(6)
            in_glossary = "GLOSSARIO" in title.upper()
            continue

        if in_glossary:
            if stripped.endswith(":") and not stripped.startswith("-"):
                pdf.ln(2)
                pdf.set_font("DejaVu", "B", 9.5)
                pdf.set_text_color(*BORDEAUX)
                pdf.set_x(20)
                pdf.multi_cell(0, 5.5, stripped)
                pdf.ln(1)
                continue

            if re.match(r"^[A-Z]{2,5}\s+—", stripped) or re.match(r"^[A-Z]{2,5}\s+/", stripped) or re.match(r"^[A-Z]{2,5}\s+-", stripped):
                pdf.ln(2)
                pdf.set_font("DejaVu", "B", 9)
                pdf.set_text_color(*BORDEAUX_DARK)
                pdf.set_x(22)
                pdf.multi_cell(0, 5, stripped)
                continue

            if stripped.startswith("Gruppo ") or stripped.startswith("Nella piattaforma:") or stripped.startswith("DOC/DOCG"):
                pdf.ln(1)
                pdf.set_font("DejaVu", "B", 8.5)
                pdf.set_text_color(*BORDEAUX)
                pdf.set_x(22)
                pdf.multi_cell(0, 5, stripped)
                continue

            pdf.set_font("DejaVu", "", 8)
            pdf.set_text_color(*TEXT_BODY)
            pdf.set_x(26)
            pdf.multi_cell(0, 4.2, stripped)
            continue

        # Non-glossary content
        if stripped.endswith(":") and not stripped.startswith("-") and not stripped.startswith("  ") and len(stripped) > 5:
            pdf.ln(2)
            pdf.set_font("DejaVu", "B", 9.5)
            pdf.set_text_color(*BORDEAUX)
            pdf.set_x(20)
            pdf.multi_cell(0, 5.5, stripped)
            pdf.ln(1)
            continue

        if stripped.startswith("- ") or stripped.startswith("  - "):
            indent = 24 if stripped.startswith("  - ") else 22
            pdf.set_font("DejaVu", "", 8.5)
            pdf.set_text_color(*TEXT_BODY)
            pdf.set_x(indent)
            pdf.multi_cell(0, 4.5, "- " + stripped.lstrip("- ").strip())
            continue

        if re.match(r"^\d+\.\s", stripped):
            pdf.ln(1)
            pdf.set_font("DejaVu", "B", 9)
            pdf.set_text_color(*BORDEAUX_DARK)
            pdf.set_x(20)
            pdf.multi_cell(0, 5, stripped)
            continue

        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(*TEXT_BODY)
        pdf.set_x(20)
        pdf.multi_cell(0, 4.5, stripped)

    pdf.output(PDF_PATH)
    print(f"PDF generato: {os.path.abspath(PDF_PATH)}")
    print(f"Dimensione: {os.path.getsize(PDF_PATH)} bytes")

if __name__ == "__main__":
    main()
