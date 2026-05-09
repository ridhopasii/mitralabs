-- Fix permissions for Invoice table
-- Run this in Supabase Dashboard > SQL Editor

-- STEP 1: Grant permissions on Invoice table
GRANT SELECT ON TABLE "Invoice" TO authenticated;
GRANT ALL ON TABLE "Invoice" TO authenticated;

-- STEP 2: Enable RLS on Invoice table
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;

-- STEP 3: Drop existing policies
DROP POLICY IF EXISTS "Invoice_admin_select" ON "Invoice";
DROP POLICY IF EXISTS "Invoice_admin_all" ON "Invoice";
DROP POLICY IF EXISTS "allow_auth_select_invoice" ON "Invoice";
DROP POLICY IF EXISTS "allow_auth_all_invoice" ON "Invoice";

-- STEP 4: Create policies for Invoice
-- Allow authenticated users to SELECT all invoices
CREATE POLICY "allow_auth_select_invoice" ON "Invoice"
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to INSERT/UPDATE/DELETE invoices
CREATE POLICY "allow_auth_all_invoice" ON "Invoice"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- STEP 5: Verify Invoice policies
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

-- STEP 6: Test query
SELECT COUNT(*) as total_invoices FROM "Invoice";
SELECT * FROM "Invoice" LIMIT 5;
