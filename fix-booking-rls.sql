-- Fix RLS policies for Booking table to allow public inserts

-- Enable RLS on Booking table (if not already enabled)
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Booking_public_insert" ON "Booking";
DROP POLICY IF EXISTS "Booking_admin_all" ON "Booking";
DROP POLICY IF EXISTS "Allow public booking inserts" ON "Booking";
DROP POLICY IF EXISTS "Allow authenticated booking access" ON "Booking";

-- Create policy to allow anyone (anon + authenticated) to INSERT bookings
CREATE POLICY "Booking_public_insert"
ON "Booking"
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users (admin) to SELECT/UPDATE/DELETE bookings
CREATE POLICY "Booking_admin_all"
ON "Booking"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'Booking';
