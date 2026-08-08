import { ServicesPage } from '@/features/services/services-page';
import { buildPageMetadata, pageSeo } from '@/lib/seo';

export const metadata = buildPageMetadata({ locale: 'fr', ...pageSeo.services.fr });

export default function Page() {
  return <ServicesPage locale="fr" />;
}
