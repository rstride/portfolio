import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import '../globals.css';
import { Footer } from '@/components/footer';
import { Navigation } from '@/components/navigation';
import { StructuredData } from '@/components/structured-data';
import { pageSeo, siteName, siteUrl, websiteJsonLd } from '@/lib/seo';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: pageSeo.home.en.title,
  description: pageSeo.home.en.description,
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary antialiased min-h-screen flex flex-col">
        <StructuredData data={websiteJsonLd()} />
        <div className="fixed inset-0 dot-grid pointer-events-none z-0"></div>
        <div className="site-ambient">
          <div className="site-ambient-glow site-ambient-glow--left"></div>
          <div className="site-ambient-glow site-ambient-glow--right"></div>
        </div>
        <Navigation />
        <main className="relative z-10 flex-grow pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
