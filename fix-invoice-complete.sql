-- Complete Invoice Table Setup
-- Run this in Supabase Dashboard > SQL Editor

-- STEP 1: Grant permissions on Invoice table
GRANT SELECT ON TABLE "Invoice" TO anon;
GRANT SELECT ON TABLE "Invoice" TO authenticated;
GRANT ALL ON TABLE "Invoice" TO authenticated;

-- STEP 2: Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- STEP 3: Enable RLS on Invoice table
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;

-- STEP 4: Drop ALL existing policies
DROP POLICY IF EXISTS "Invoice_admin_select" ON "Invoice";
DROP POLICY IF EXISTS "Invoice_admin_all" ON "Invoice";
DROP POLICY IF EXISTS "allow_auth_select_invoice" ON "Invoice";
DROP POLICY IF EXISTS "allow_auth_all_invoice" ON "Invoice";
DROP POLICY IF EXISTS "allow_anon_select_invoice" ON "Invoice";
DROP POLICY IF EXISTS "allow_public_read_invoice" ON "Invoice";

-- STEP 5: Create policies for Invoice

-- Allow ANYONE (anon + authenticated) to SELECT invoices (for public invoice page)
CREATE POLICY "allow_public_read_invoice" ON "Invoice"
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users (admins) to do everything
CREATE POLICY "allow_auth_all_invoice" ON "Invoice"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- STEP 6: Verify Invoice policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'Invoice'
ORDER BY policyname;

-- STEP 7: Test queries
SELECT COUNT(*) as total_invoices FROM "Invoice";
SELECT
  invoice_number,
  client_name,
  amount,
  status,
  created_at
FROM "Invoice"
ORDER BY created_at DESC
LIMIT 10;
