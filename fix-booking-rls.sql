-- Fix permissions for Booking table to allow public inserts
-- Run this in Supabase Dashboard > SQL Editor

-- STEP 1: Grant schema usage to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- STEP 2: Grant INSERT permission on Booking table to anon role
GRANT INSERT ON TABLE "Booking" TO anon;
GRANT ALL ON TABLE "Booking" TO authenticated;

-- STEP 3: Grant sequence usage (for auto-incrementing ID)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- STEP 4: Enable RLS on Booking table
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

-- STEP 5: Drop existing policies if they exist
DROP POLICY IF EXISTS "Booking_public_insert" ON "Booking";
DROP POLICY IF EXISTS "Booking_admin_all" ON "Booking";
DROP POLICY IF EXISTS "Booking_public_select" ON "Booking";

-- STEP 6: Create policy to allow public inserts (for the booking form)
CREATE POLICY "Booking_public_insert" ON "Booking"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- STEP 7: Create policy to allow authenticated users (admins) to read all bookings
CREATE POLICY "Booking_admin_all" ON "Booking"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- STEP 8: Verify permissions
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name='Booking';
