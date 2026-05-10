-- Grant table-level privileges to authenticated and anon roles
-- This is REQUIRED for Supabase RLS to work properly

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."SiteConfig" TO authenticated;
GRANT SELECT ON TABLE public."SiteConfig" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."HeroSection" TO authenticated;
GRANT SELECT ON TABLE public."HeroSection" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Invoice" TO authenticated;
GRANT SELECT ON TABLE public."Invoice" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Booking" TO authenticated;
GRANT SELECT, INSERT ON TABLE public."Booking" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Project" TO authenticated;
GRANT SELECT ON TABLE public."Project" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."ServicePlan" TO authenticated;
GRANT SELECT ON TABLE public."ServicePlan" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."BlogPost" TO authenticated;
GRANT SELECT ON TABLE public."BlogPost" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."TeamMember" TO authenticated;
GRANT SELECT ON TABLE public."TeamMember" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Testimonial" TO authenticated;
GRANT SELECT ON TABLE public."Testimonial" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."FAQ" TO authenticated;
GRANT SELECT ON TABLE public."FAQ" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."AdminLog" TO authenticated;

GRANT SELECT, INSERT ON TABLE public."SiteMessage" TO authenticated;
GRANT INSERT ON TABLE public."SiteMessage" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."UploadedImage" TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."User" TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Client" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."ClientProject" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."ProjectUpdate" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."ProjectFile" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."NewsletterSub" TO authenticated;
GRANT INSERT ON TABLE public."NewsletterSub" TO anon;
