import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/content/site";
import { Navbar } from "@/features/layout/components/navbar";
import { Footer } from "@/features/layout/components/footer";
import { AnalyticsProvider } from "@/hooks/useAnalytics";
import { ThemeProvider } from "@/components/theme-provider";

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
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            <Navbar />
            <main className="flex-1 pt-[var(--site-navbar-height,6.5rem)]">{children}</main>
            <Footer />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
