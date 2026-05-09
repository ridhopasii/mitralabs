-- COMPLETE FIX for Booking table permissions and RLS
-- Run this in Supabase Dashboard > SQL Editor

-- STEP 1: Grant all necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table permissions
GRANT SELECT, INSERT ON TABLE "Booking" TO anon;
GRANT ALL ON TABLE "Booking" TO authenticated;

-- Grant sequence permissions (for auto-increment ID)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- STEP 2: Disable RLS temporarily to test
ALTER TABLE "Booking" DISABLE ROW LEVEL SECURITY;

-- STEP 3: Check if data exists
SELECT COUNT(*) as total_bookings FROM "Booking";
SELECT * FROM "Booking" ORDER BY created_at DESC LIMIT 5;

-- STEP 4: Re-enable RLS with correct policies
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Booking_public_insert" ON "Booking";
DROP POLICY IF EXISTS "Booking_admin_all" ON "Booking";
DROP POLICY IF EXISTS "Booking_public_select" ON "Booking";
DROP POLICY IF EXISTS "Booking_admin_select" ON "Booking";
DROP POLICY IF EXISTS "Booking_admin_update" ON "Booking";
DROP POLICY IF EXISTS "Booking_admin_delete" ON "Booking";
DROP POLICY IF EXISTS "Enable insert for anon" ON "Booking";
DROP POLICY IF EXISTS "Enable read access for all users" ON "Booking";

-- Create new policies with correct permissions
-- Policy 1: Allow anonymous users to INSERT (for public booking form)
CREATE POLICY "allow_anon_insert" ON "Booking"
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy 2: Allow authenticated users to INSERT
CREATE POLICY "allow_auth_insert" ON "Booking"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Allow authenticated users to SELECT all bookings
CREATE POLICY "allow_auth_select" ON "Booking"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 4: Allow authenticated users to UPDATE bookings
CREATE POLICY "allow_auth_update" ON "Booking"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Allow authenticated users to DELETE bookings
CREATE POLICY "allow_auth_delete" ON "Booking"
  FOR DELETE
  TO authenticated
  USING (true);

-- STEP 5: Verify everything
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'Booking'
ORDER BY policyname;

-- STEP 6: Test query as authenticated user
SELECT COUNT(*) as total FROM "Booking";
SELECT
  id,
  customer_name,
  customer_email,
  service_type,
  status,
  created_at
FROM "Booking"
ORDER BY created_at DESC
LIMIT 10;
