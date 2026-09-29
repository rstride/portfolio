import { HomePage } from '@/features/home/home-page';
import { buildPageMetadata, pageSeo } from '@/lib/seo';

export const metadata = buildPageMetadata({ locale: 'en', ...pageSeo.home.en });

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}
