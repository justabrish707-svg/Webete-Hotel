-- Migration: Add security improvements to the Wubeté Hotel database
-- Run this in your Supabase SQL Editor

-- 1. Add missing columns to bookings table (if not already present)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount integer DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_ref text;

-- 2. Create system_logs table for audit trail
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS on system_logs (admin read only)
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view logs"
  ON system_logs FOR SELECT
  TO authenticated USING (true);

-- Edge Functions use service role key to insert — no policy needed for insert.

-- 4. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read) WHERE read = false;

-- 5. Add DB-level constraints for data integrity
-- (These prevent bad data even if validation is bypassed)
-- Note: Use ALTER TABLE ... ADD CONSTRAINT IF NOT EXISTS (PostgreSQL 9.6+)
DO $$
BEGIN
  -- Ensure check-out is after check-in  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_dates_check'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_dates_check 
      CHECK (check_out > check_in);
  END IF;

  -- Ensure amount is non-negative
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_amount_check'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_amount_check 
      CHECK (amount >= 0);
  END IF;

  -- Ensure guest count is reasonable
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_guests_check'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_guests_check 
      CHECK (guests BETWEEN 1 AND 10);
  END IF;

-- 6. Harden Row Level Security (RLS)
-- Revoke the insecure "Public can add bookings" policy from older schema.
-- Since we now use Edge Functions (service_role), guests should NEVER insert directly.
DROP POLICY IF EXISTS "Public can add bookings" ON bookings;
DROP POLICY IF EXISTS "Public can add messages" ON messages;
DROP POLICY IF EXISTS "Public rooms are viewable by everyone" ON rooms;

-- New strict policies:
-- Guests/Public:
DROP POLICY IF EXISTS "Anyone can view rooms" ON rooms;
CREATE POLICY "Anyone can view rooms" ON rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can submit contact logic" ON messages;
CREATE POLICY "Anyone can submit contact logic" ON messages FOR INSERT WITH CHECK (true);

-- Admins (authenticated):
DROP POLICY IF EXISTS "Admins can manage rooms" ON rooms;
CREATE POLICY "Admins can manage rooms" ON rooms TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;
CREATE POLICY "Admins can manage bookings" ON bookings TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage messages" ON messages;
CREATE POLICY "Admins can manage messages" ON messages TO authenticated USING (true) WITH CHECK (true);

