import { HomePage } from '@/features/home/home-page';
import { buildPageMetadata, pageSeo } from '@/lib/seo';

export const metadata = buildPageMetadata({ locale: 'fr', ...pageSeo.home.fr });

export default function FrenchHomePage() {
  return <HomePage locale="fr" />;
}
