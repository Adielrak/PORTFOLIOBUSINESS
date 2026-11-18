import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "folio.ai — Your portfolio in 60 seconds",
  description: "AI-powered portfolio and resume generator. One input flow, impressive output, instantly shareable.",
  openGraph: {
    title: "folio.ai — Your portfolio in 60 seconds",
    description: "Generate a stunning portfolio and ATS-ready resume with AI in under 2 minutes.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-navy text-cream antialiased font-sans">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
