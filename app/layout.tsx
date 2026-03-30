import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://rstride.fr'),
  title: 'Romain Stride // Pentester Portfolio',
  description: 'Offensive Security & Development. Pentester, Security Researcher & Developer.',
  openGraph: {
    title: 'Romain Stride // Pentester Portfolio',
    description: 'Offensive Security & Development. Pentester, Security Researcher & Developer.',
    url: 'https://rstride.fr',
    siteName: 'Romain Stride',
    images: [
      {
        url: '/romain.png',
        width: 480,
        height: 480,
        alt: 'Romain Stride - Offensive Security',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Romain Stride // Pentester Portfolio',
    description: 'Offensive Security & Development. Pentester, Security Researcher & Developer.',
    images: ['/romain.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary antialiased min-h-screen flex flex-col">
        <div className="fixed inset-0 dot-grid pointer-events-none z-0"></div>
        <div className="site-ambient">
          <div className="site-ambient-glow site-ambient-glow--left"></div>
          <div className="site-ambient-glow site-ambient-glow--right"></div>
        </div>
        <Navigation />
        <main className="relative z-10 flex-grow pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
