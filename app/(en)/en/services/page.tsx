import { ServicesPage } from '@/features/services/services-page';
import { buildPageMetadata, pageSeo } from '@/lib/seo';

export const metadata = buildPageMetadata({ locale: 'en', ...pageSeo.services.en });

export default function Page() {
  return <ServicesPage locale="en" />;
}
