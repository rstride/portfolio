import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { site } from "@/content/site";
import { Navbar } from "@/features/layout/components/navbar";
import { Footer } from "@/features/layout/components/footer";
import { AnalyticsProvider } from "@/shared/providers/analytics-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rstride.fr"),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: `${site.role}. ${site.hero.subtext}`,
  openGraph: { title: `${site.name} — ${site.role}`, description: `${site.role}. ${site.hero.subtext}`, url: "/", siteName: site.name, locale: "fr_FR", type: "website" },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.company.tagline}`, description: site.hero.subtext },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} flex min-h-screen flex-col bg-background text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AnalyticsProvider>
            <Navbar />
            <main className="flex-1 pt-[var(--site-navbar-height,5rem)]">{children}</main>
            <Footer />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
