# B&F 45 — Intelligent Wine Pairing & Curated Cellar

La prima piattaforma digitale dedicata all'Oltrepò Pavese, il territorio del vino più vasto della Lombardia.

Ultimo aggiornamento: 18 Settembre 2026

## Cos'è

B&F 45 unisce tre cose che nessuno aveva mai messo insieme per questo territorio:

1. **Motore di abbinamento IRC** — analisi chimico-molecolare cibo-vino con AI (Claude Anthropic)
2. **Cantina digitale** — catalogo vini con 110+ etichette dell'Oltrepò e vini del mondo
3. **Hub export B2B** — AI matching cantine-buyer, RFQ, export process

## Motore di abbinamento

Ogni vino riceve un **punteggio IRC su 100** basato su 4 componenti:
- Chimica (0-40): tannini-proteine, acidita-grassi, zuccheri-dolcezza
- Aromatico (0-25): corrispondenza composti volatili
- Struttura (0-20): corpo-alcol-intensita
- Pulizia palato (0-15): capacita di pulire il palato

Tre modalita:
- **Motore locale** (gratuito): regole chimiche codificate, genera tutti i campi tecnici
- **Motore AI base** (codice): Claude 3.5 Haiku, 60 vini campionati
- **Motore AI PRO** (codice PRO): Claude Sonnet 4, 30 vini, due discorsi narrativi + reazione digestiva

### PRO: due discorsi per vino
- **Il sommelier**: tecnico professionale, cita composti e reazioni chimiche
- **L'appassionato**: emozionale, metafore vivide, per chi ama il vino senza essere tecnico

### PRO: reazione digestiva
Analisi di come il vino interagisce con la digestione: enzimi (pepsina, lipasi, amilasi), svuotamento gastrico, assorbimento nutrienti, microbiota intestinale.

## Tecnologia

- Frontend: React + TypeScript + Vite
- Backend: Supabase (PostgreSQL, RLS, Edge Functions Deno)
- AI: Claude (Anthropic) — Haiku (base), Sonnet 4 (PRO)
- Stile: Tailwind CSS 4, palette bordeaux/oro/crema
- Lingue: 7 (IT, EN, FR, ES, DE, JP, NL)

## Documenti

- `LINEE_GUIDA.txt` — guida operativa per gestire la piattaforma
- `PRESENTAZIONE_INVESTITORI.txt` — presentazione per investitori
- `EMAIL_INVESTITORI.txt` — template email per investitori
