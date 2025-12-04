import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnalyticsProvider } from "@/hooks/useAnalytics";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

