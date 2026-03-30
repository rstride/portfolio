import type { Metadata } from 'next';
import { DocumentLanguage } from '@/components/document-language';

export const metadata: Metadata = {
  openGraph: {
    locale: 'en_US',
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocumentLanguage lang="en" />
      {children}
    </>
  );
}
