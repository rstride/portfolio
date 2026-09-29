import Link from 'next/link';
import { ArrowRight, BookOpen, Check, Cloud, Code2, Globe, Network } from 'lucide-react';
import * as motion from 'motion/react-client';

import { StructuredData } from '@/components/structured-data';
import { professionalServiceJsonLd } from '@/lib/seo';
import { ServiceCategories } from '@/features/services/service-categories';
import { servicesContent, type AuditOffer, type ServiceTone } from '@/features/services/services-content';
import type { ContactLocale } from '@/features/contact/schema';

const auditIcons = {
  'web-application-pentest': Globe,
  'api-security-assessment': Code2,
  'cloud-devsecops': Cloud,
  'internal-infrastructure': Network,
} satisfies Record<AuditOffer['slug'], typeof Globe>;

function toneClass(tone: ServiceTone) {
  return `service-tone-${tone}`;
}

export function ServicesPage({ locale }: { locale: ContactLocale }) {
  const t = servicesContent[locale];
  const prefix = locale === 'en' ? '/en' : '';
  const contactPath = `${prefix}/contact`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className="page-frame services-page py-12 xl:py-16">
      <StructuredData data={professionalServiceJsonLd(locale)} />

      <header className="services-hero">
        <span className="services-kicker">{t.kicker}</span>
        <h1 className="services-hero-title">{t.title}</h1>
        <p className="services-hero-intro">{t.intro}</p>
        <Link href={`${contactPath}?source=services_hero`} className="cta-primary inline-flex text-sm px-7 py-4 mt-7">
          {t.primaryCta}<ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <ServiceCategories locale={locale} />
      </header>

      <section id="audit-offers" className="services-section" aria-labelledby="audits-title">
        <SectionHeading id="audits-title" title={t.auditSection} intro={t.auditIntro} />
        <div className="service-offer-grid">
          {t.audits.map((audit) => {
            const Icon = auditIcons[audit.slug];
            return (
              <article key={audit.slug} className={`service-offer-card ${toneClass(audit.tone)}`}>
                <div className="service-offer-icon"><Icon className="size-5" aria-hidden="true" /></div>
                <h3>{audit.title}</h3>
                <p className="service-offer-summary">{audit.summary}</p>
                <div className="service-offer-detail"><span>{t.fitLabel}</span><p>{audit.fit}</p></div>
                <div className="service-offer-detail">
                  <span>{t.deliverablesLabel}</span>
                  <ul className="service-deliverable-list">
                    {audit.deliverables.map((item) => <li key={item}><Check className="size-4" aria-hidden="true" />{item}</li>)}
                  </ul>
                </div>
                <details className="service-technical-scope">
                  <summary>{t.scopeLabel}<span className="sr-only"> — {audit.title}</span></summary>
                  <ul className="service-tag-list">{audit.scope.map((item) => <li key={item}>{item}</li>)}</ul>
                </details>
                <Link href={`${contactPath}?service=${audit.slug}&source=services_offer`} className="services-simple-cta">
                  <span>{t.offerCta}<span className="sr-only"> — {audit.title}</span></span><ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section id="training-offers" className="services-section" aria-labelledby="training-title">
        <SectionHeading id="training-title" title={t.trainingSection} intro={t.trainingIntro} />
        <div className="service-training-grid">
          {t.training.map((program) => (
            <article key={program.slug} className={`service-training-card ${toneClass(program.tone)}`}>
              <h3>{program.title}</h3>
              <p className="service-offer-summary">{program.summary}</p>
              <div className="service-offer-detail"><span>{t.fitLabel}</span><p>{program.audience}</p></div>
              <div className="service-offer-detail"><span>{t.formatLabel}</span><p>{program.format}</p></div>
              <div className="service-offer-detail"><span>{t.outcomeLabel}</span><p>{program.outcome}</p></div>
              <Link href={`${contactPath}?service=${program.slug}&source=services_training`} className="services-simple-cta">
                <span>{t.trainingCta}<span className="sr-only"> — {program.title}</span></span><ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="services-section" aria-labelledby="process-title">
        <SectionHeading id="process-title" title={t.processSection} intro={t.processIntro} />
        <ol className="service-process-grid">
          {t.process.map((step, index) => (
            <li key={step.title} className="service-process-step">
              <span aria-hidden="true">{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="services-blog" aria-labelledby="services-blog-title">
        <BookOpen className="size-6 text-secondary" aria-hidden="true" />
        <div><h2 id="services-blog-title">{t.blogTitle}</h2><p>{t.blogText}</p></div>
        <Link href={`${prefix}/blog`} className="cta-text inline-flex">{t.blogCta}<ArrowRight className="size-4" aria-hidden="true" /></Link>
      </section>

      <section className="services-closing" aria-labelledby="services-closing-title">
        <div><h2 id="services-closing-title">{t.closingTitle}</h2><p>{t.closingText}</p></div>
        <div>
          <ul>{t.closingChecklist.map((item) => <li key={item}><Check className="size-4" aria-hidden="true" />{item}</li>)}</ul>
          <Link href={`${contactPath}?source=services_closing`} className="cta-primary inline-flex text-sm px-7 py-4 mt-7">
            {t.closingCta}<ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </motion.div>
  );
}

function SectionHeading({ id, title, intro }: { id: string; title: string; intro: string }) {
  return <div className="services-heading"><h2 id={id}>{title}</h2><p>{intro}</p></div>;
}
