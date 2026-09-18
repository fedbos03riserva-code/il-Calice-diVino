-- Add new fields to winery_qr_data for richer QR panel
ALTER TABLE winery_qr_data
  ADD COLUMN IF NOT EXISTS descrizione text,
  ADD COLUMN IF NOT EXISTS email_contatto text,
  ADD COLUMN IF NOT EXISTS telefono_contatto text,
  ADD COLUMN IF NOT EXISTS sito_web text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS note_deglustazione text;
