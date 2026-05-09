import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://rstride.fr/en',
    languages: {
      fr: 'https://rstride.fr',
      en: 'https://rstride.fr/en',
    },
  },
  openGraph: {
    locale: 'en_US',
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
