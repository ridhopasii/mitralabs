-- Align the database schema with the CMS code paths used by the app.
ALTER TABLE "SiteConfig"
  ADD COLUMN IF NOT EXISTS "json_content" JSONB;

CREATE TABLE IF NOT EXISTS "Booking" (
  "id" SERIAL PRIMARY KEY,
  "customer_name" TEXT NOT NULL,
  "customer_email" TEXT NOT NULL,
  "customer_phone" TEXT NOT NULL,
  "organization_name" TEXT,
  "position" TEXT,
  "service_type" TEXT NOT NULL,
  "plan_name" TEXT NOT NULL,
  "project_brief" TEXT NOT NULL,
  "desired_domain" TEXT,
  "business_industry" TEXT,
  "reference_websites" TEXT,
  "target_audience" TEXT,
  "primary_cta" TEXT,
  "competitors_list" TEXT,
  "integrations_needed" TEXT,
  "biggest_expectation" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Pending',
  "total_price" DOUBLE PRECISION NOT NULL,
  "scheduled_date" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Invoice"
  ALTER COLUMN "project_id" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "booking_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "client_name" TEXT,
  ADD COLUMN IF NOT EXISTS "client_email" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Invoice_booking_id_fkey'
  ) THEN
    ALTER TABLE "Invoice"
      ADD CONSTRAINT "Invoice_booking_id_fkey"
      FOREIGN KEY ("booking_id") REFERENCES "Booking"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Invoice_project_id_idx" ON "Invoice"("project_id");
CREATE INDEX IF NOT EXISTS "Invoice_booking_id_idx" ON "Invoice"("booking_id");

ALTER TABLE "SiteConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HeroSection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServicePlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FAQ" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsletterSub" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'SiteConfig', 'HeroSection', 'ServicePlan', 'Project', 'BlogPost',
    'TeamMember', 'Testimonial', 'FAQ'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_public_read" ON "%s"', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_public_read" ON "%s" FOR SELECT TO anon, authenticated USING (true)', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_admin_write" ON "%s"', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_admin_write" ON "%s" FOR ALL TO authenticated USING (true) WITH CHECK (true)', tbl, tbl);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "SiteMessage_public_insert" ON "SiteMessage";
CREATE POLICY "SiteMessage_public_insert" ON "SiteMessage" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "SiteMessage_admin_all" ON "SiteMessage";
CREATE POLICY "SiteMessage_admin_all" ON "SiteMessage" FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Booking_public_insert" ON "Booking";
CREATE POLICY "Booking_public_insert" ON "Booking" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Booking_admin_all" ON "Booking";
CREATE POLICY "Booking_admin_all" ON "Booking" FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Invoice_admin_all" ON "Invoice";
CREATE POLICY "Invoice_admin_all" ON "Invoice" FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "AdminLog_admin_all" ON "AdminLog";
CREATE POLICY "AdminLog_admin_all" ON "AdminLog" FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "NewsletterSub_public_insert" ON "NewsletterSub";
CREATE POLICY "NewsletterSub_public_insert" ON "NewsletterSub" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "NewsletterSub_admin_all" ON "NewsletterSub";
CREATE POLICY "NewsletterSub_admin_all" ON "NewsletterSub" FOR ALL TO authenticated USING (true) WITH CHECK (true);
