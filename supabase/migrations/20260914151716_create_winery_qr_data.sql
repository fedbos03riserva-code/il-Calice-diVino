/*
# Create winery_qr_data table for dynamic QR codes

1. New Tables
- `winery_qr_data` — stores live, editable data behind each winery's QR code
  - `id` (uuid, primary key)
  - `winery_id` (text, not null, unique)
  - `annata` (text, default current vintage)
  - `stock` (text, nullable)
  - `prezzo_aggiornato` (text, nullable)
  - `premi` (text, nullable)
  - `eventi` (text, nullable)
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `winery_qr_data`.
- No-auth app: SELECT/INSERT/UPDATE public to anon, authenticated.
- No DELETE for safety.

3. Notes
- Same QR printed once on the label always points to the same URL.
- The content behind that URL is updated by the winery in real time.
*/

CREATE TABLE IF NOT EXISTS winery_qr_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  winery_id text NOT NULL UNIQUE,
  annata text NOT NULL DEFAULT '2023',
  stock text,
  prezzo_aggiornato text,
  premi text,
  eventi text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE winery_qr_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_qr_data" ON winery_qr_data;
CREATE POLICY "anon_select_qr_data" ON winery_qr_data FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_qr_data" ON winery_qr_data;
CREATE POLICY "anon_insert_qr_data" ON winery_qr_data FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_qr_data" ON winery_qr_data;
CREATE POLICY "anon_update_qr_data" ON winery_qr_data FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO winery_qr_data (winery_id, annata, stock, prezzo_aggiornato, premi, eventi)
VALUES
  ('WIN001', '2023', 'Disponibile - 12.000 bt', 'EUR 7.50 FOB', 'Gold Medal Concours Mondial 2024', 'Visite guidees chaque samedi'),
  ('WIN002', '2023', 'Disponibile - 3.500 bt', 'EUR 16.00 FOB', 'Tre Bicchieri Gambero Rosso 2024', 'Degustazione verticale'),
  ('WIN003', '2022', 'Limitata - 800 bt', 'EUR 18.00 FOB', 'Bio Award 2023', 'Open cantina settembre'),
  ('WIN004', '2023', 'Disponibile - 8.000 bt', 'EUR 14.00 FOB', 'Metodo Classico Award', 'Festa vendemmia ottobre'),
  ('WIN005', '2023', 'Disponibile - 4.200 bt', 'EUR 17.00 FOB', 'Gold Sakura Award Japan 2024', 'Tasting privato'),
  ('WIN006', '2022', 'Disponibile - 5.000 bt', 'EUR 18.00 FOB', 'Cruase Excellence Award', 'Visita cantina sotterranea'),
  ('WIN007', '2023', 'Disponibile - 2.000 bt', 'EUR 10.00 EXW', '', 'Degustazione biologica'),
  ('WIN008', '2023', 'Disponibile - 6.500 bt', 'EUR 9.00 FOB', 'Vegan Wine Award 2024', 'Moscatoween ottobre'),
  ('WIN009', '2023', 'Disponibile - 3.800 bt', 'EUR 12.00 FOB', 'Best Barbera Oltrepo 2023', 'Barbera Night settembre'),
  ('WIN010', '2022', 'Riserva - 500 bt', 'EUR 22.00 EXW', 'Buttafuoco Storico Top 10', 'Assaggio riserva'),
  ('WIN011', '2023', 'Disponibile - 2.500 bt', 'EUR 11.00 FOB', 'Castello Wine Excellence', 'Visita al castello'),
  ('WIN012', '2023', 'Disponibile - 7.000 bt', 'EUR 10.00 FOB', 'Moscato d''Oro 2024', 'Moscato Festival settembre')
ON CONFLICT (winery_id) DO NOTHING;
