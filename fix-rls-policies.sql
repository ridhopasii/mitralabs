-- =============================================
-- FIX: Enable RLS policies for SiteConfig table
-- This allows authenticated users (admin) to read/write settings
-- And allows anonymous users (visitors/invoice page) to READ settings
-- =============================================

-- 1. Enable RLS on SiteConfig (if not already enabled)
ALTER TABLE "SiteConfig" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Allow public read SiteConfig" ON "SiteConfig";
DROP POLICY IF EXISTS "Allow authenticated read SiteConfig" ON "SiteConfig";
DROP POLICY IF EXISTS "Allow authenticated insert SiteConfig" ON "SiteConfig";
DROP POLICY IF EXISTS "Allow authenticated update SiteConfig" ON "SiteConfig";
DROP POLICY IF EXISTS "Allow anon read SiteConfig" ON "SiteConfig";
DROP POLICY IF EXISTS "SiteConfig_select_all" ON "SiteConfig";
DROP POLICY IF EXISTS "SiteConfig_insert_auth" ON "SiteConfig";
DROP POLICY IF EXISTS "SiteConfig_update_auth" ON "SiteConfig";

-- 3. Allow ANYONE to READ SiteConfig (needed for invoice page, visitors, etc.)
CREATE POLICY "SiteConfig_select_all"
  ON "SiteConfig"
  FOR SELECT
  USING (true);

-- 4. Allow AUTHENTICATED users to INSERT into SiteConfig (admin)
CREATE POLICY "SiteConfig_insert_auth"
  ON "SiteConfig"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Allow AUTHENTICATED users to UPDATE SiteConfig (admin)
CREATE POLICY "SiteConfig_update_auth"
  ON "SiteConfig"
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- Also fix AdminLog table (same permission issue)
-- =============================================
ALTER TABLE "AdminLog" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AdminLog_select_auth" ON "AdminLog";
DROP POLICY IF EXISTS "AdminLog_insert_auth" ON "AdminLog";

CREATE POLICY "AdminLog_select_auth"
  ON "AdminLog"
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "AdminLog_insert_auth"
  ON "AdminLog"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- Also fix HeroSection table
-- =============================================
ALTER TABLE "HeroSection" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "HeroSection_select_all" ON "HeroSection";
DROP POLICY IF EXISTS "HeroSection_insert_auth" ON "HeroSection";
DROP POLICY IF EXISTS "HeroSection_update_auth" ON "HeroSection";

CREATE POLICY "HeroSection_select_all"
  ON "HeroSection"
  FOR SELECT
  USING (true);

CREATE POLICY "HeroSection_insert_auth"
  ON "HeroSection"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "HeroSection_update_auth"
  ON "HeroSection"
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- Fix ALL other tables that admin writes to
-- =============================================

-- Booking
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Booking_select_all" ON "Booking";
DROP POLICY IF EXISTS "Booking_insert_all" ON "Booking";
DROP POLICY IF EXISTS "Booking_update_auth" ON "Booking";
CREATE POLICY "Booking_select_all" ON "Booking" FOR SELECT USING (true);
CREATE POLICY "Booking_insert_all" ON "Booking" FOR INSERT WITH CHECK (true);
CREATE POLICY "Booking_update_auth" ON "Booking" FOR UPDATE USING (auth.role() = 'authenticated');

-- Invoice
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Invoice_select_all" ON "Invoice";
DROP POLICY IF EXISTS "Invoice_insert_auth" ON "Invoice";
DROP POLICY IF EXISTS "Invoice_update_auth" ON "Invoice";
CREATE POLICY "Invoice_select_all" ON "Invoice" FOR SELECT USING (true);
CREATE POLICY "Invoice_insert_auth" ON "Invoice" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Invoice_update_auth" ON "Invoice" FOR UPDATE USING (auth.role() = 'authenticated');

-- Project
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Project_select_all" ON "Project";
DROP POLICY IF EXISTS "Project_insert_auth" ON "Project";
DROP POLICY IF EXISTS "Project_update_auth" ON "Project";
CREATE POLICY "Project_select_all" ON "Project" FOR SELECT USING (true);
CREATE POLICY "Project_insert_auth" ON "Project" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Project_update_auth" ON "Project" FOR UPDATE USING (auth.role() = 'authenticated');

-- ServicePlan
ALTER TABLE "ServicePlan" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ServicePlan_select_all" ON "ServicePlan";
DROP POLICY IF EXISTS "ServicePlan_insert_auth" ON "ServicePlan";
DROP POLICY IF EXISTS "ServicePlan_update_auth" ON "ServicePlan";
CREATE POLICY "ServicePlan_select_all" ON "ServicePlan" FOR SELECT USING (true);
CREATE POLICY "ServicePlan_insert_auth" ON "ServicePlan" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ServicePlan_update_auth" ON "ServicePlan" FOR UPDATE USING (auth.role() = 'authenticated');

-- BlogPost
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "BlogPost_select_all" ON "BlogPost";
DROP POLICY IF EXISTS "BlogPost_insert_auth" ON "BlogPost";
DROP POLICY IF EXISTS "BlogPost_update_auth" ON "BlogPost";
CREATE POLICY "BlogPost_select_all" ON "BlogPost" FOR SELECT USING (true);
CREATE POLICY "BlogPost_insert_auth" ON "BlogPost" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "BlogPost_update_auth" ON "BlogPost" FOR UPDATE USING (auth.role() = 'authenticated');

-- TeamMember
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "TeamMember_select_all" ON "TeamMember";
DROP POLICY IF EXISTS "TeamMember_insert_auth" ON "TeamMember";
DROP POLICY IF EXISTS "TeamMember_update_auth" ON "TeamMember";
CREATE POLICY "TeamMember_select_all" ON "TeamMember" FOR SELECT USING (true);
CREATE POLICY "TeamMember_insert_auth" ON "TeamMember" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "TeamMember_update_auth" ON "TeamMember" FOR UPDATE USING (auth.role() = 'authenticated');

-- Testimonial
ALTER TABLE "Testimonial" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Testimonial_select_all" ON "Testimonial";
DROP POLICY IF EXISTS "Testimonial_insert_auth" ON "Testimonial";
DROP POLICY IF EXISTS "Testimonial_update_auth" ON "Testimonial";
CREATE POLICY "Testimonial_select_all" ON "Testimonial" FOR SELECT USING (true);
CREATE POLICY "Testimonial_insert_auth" ON "Testimonial" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Testimonial_update_auth" ON "Testimonial" FOR UPDATE USING (auth.role() = 'authenticated');

-- FAQ
ALTER TABLE "FAQ" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "FAQ_select_all" ON "FAQ";
DROP POLICY IF EXISTS "FAQ_insert_auth" ON "FAQ";
DROP POLICY IF EXISTS "FAQ_update_auth" ON "FAQ";
CREATE POLICY "FAQ_select_all" ON "FAQ" FOR SELECT USING (true);
CREATE POLICY "FAQ_insert_auth" ON "FAQ" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "FAQ_update_auth" ON "FAQ" FOR UPDATE USING (auth.role() = 'authenticated');

-- SiteMessage (anyone can insert = contact form, only auth can read)
ALTER TABLE "SiteMessage" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "SiteMessage_select_auth" ON "SiteMessage";
DROP POLICY IF EXISTS "SiteMessage_insert_all" ON "SiteMessage";
CREATE POLICY "SiteMessage_select_auth" ON "SiteMessage" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "SiteMessage_insert_all" ON "SiteMessage" FOR INSERT WITH CHECK (true);
