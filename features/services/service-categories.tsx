import Link from 'next/link';
import { ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';

import type { ContactLocale } from '@/features/contact/schema';
import { servicesContent } from '@/features/services/services-content';

export function ServiceCategories({ locale, hrefPrefix = '', headingLevel = 'h2' }: {
  locale: ContactLocale;
  hrefPrefix?: string;
  headingLevel?: 'h2' | 'h3';
}) {
  const t = servicesContent[locale];
  const Heading = headingLevel;

  return (
    <div className="service-category-grid" aria-label={t.categoriesLabel}>
      {t.categories.map((category) => {
        const Icon = category.id === 'audit-offers' ? ShieldCheck : GraduationCap;
        return (
          <Link key={category.id} href={`${hrefPrefix}#${category.id}`}
            className={`service-category-card ${category.id === 'audit-offers' ? 'service-tone-primary' : 'service-tone-secondary'}`}>
            <Icon className="size-6" aria-hidden="true" />
            <Heading>{category.title}</Heading>
            <p>{category.description}</p>
            <span className="service-category-link">{category.linkLabel}<ArrowRight className="size-4" aria-hidden="true" /></span>
          </Link>
        );
      })}
    </div>
  );
}
