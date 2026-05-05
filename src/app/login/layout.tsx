import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to Mitralabs Admin Panel",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide Navbar and FloatingWhatsApp for login page
  return (
    <div className="login-page">
      <style jsx global>{`
        .login-page ~ nav,
        .login-page ~ div[class*="fixed"] {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}

