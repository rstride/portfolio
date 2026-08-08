import Link from 'next/link';
import { ArrowRight, Check, Cloud, Code2, Globe, Network, ShieldCheck } from 'lucide-react';
import * as motion from 'motion/react-client';

import { StructuredData } from '@/components/structured-data';
import { professionalServiceJsonLd } from '@/lib/seo';
import { servicesContent, type AuditOffer, type ServiceTone } from '@/features/services/services-content';
import type { ContactLocale } from '@/features/contact/schema';

const auditIcons = {
  'web-application-pentest': Globe,
  'api-security-assessment': Code2,
  'cloud-devsecops': Cloud,
  'internal-infrastructure': Network,
} satisfies Record<AuditOffer['slug'], typeof Globe>;

function toneClass(tone: ServiceTone) {
  return tone === 'secondary' ? 'service-tone-secondary' : tone === 'tertiary' ? 'service-tone-tertiary' : 'service-tone-primary';
}

export function ServicesPage({ locale }: { locale: ContactLocale }) {
  const t = servicesContent[locale];
  const contactPath = locale === 'en' ? '/en/contact' : '/contact';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-frame services-page py-12 xl:py-16"
    >
      <StructuredData data={professionalServiceJsonLd(locale)} />

      <header className="services-hero">
        <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs mb-6 block">{t.kicker}</span>
        <div className="services-hero-layout">
          <div>
            <h1 className="services-hero-title">{t.title}</h1>
            <p className="services-hero-intro">{t.intro}</p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link href={`${contactPath}?source=services_hero`} className="cta-primary inline-flex text-sm px-7 py-4">
                {t.primaryCta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#audit-offers" className="cta-secondary inline-flex text-sm px-7 py-4">{t.secondaryCta}</Link>
            </div>
          </div>
          <ul className="services-hero-signals" aria-label={t.auditSection}>
            {t.heroSignals.map((signal) => <li key={signal}><Check className="h-4 w-4" />{signal}</li>)}
          </ul>
        </div>
      </header>

      <section id="audit-offers" className="services-section" aria-labelledby="audits-title">
        <SectionHeading id="audits-title" title={t.auditSection} intro={t.auditIntro} tone="primary" />
        <div className="service-offer-grid">
          {t.audits.map((audit, index) => {
            const Icon = auditIcons[audit.slug]!;
            return (
              <article key={audit.slug} className={`service-offer-card ${toneClass(audit.tone)}`}>
                <div className="service-offer-index">AUDIT_{String(index + 1).padStart(2, '0')}</div>
                <div className="service-offer-icon"><Icon className="h-5 w-5" /></div>
                <h2>{audit.title}</h2>
                <p className="service-offer-summary">{audit.summary}</p>
                <div className="service-offer-detail"><span>{t.fitLabel}</span><p>{audit.fit}</p></div>
                <div className="service-offer-detail"><span>{t.scopeLabel}</span><ul className="service-tag-list">{audit.scope.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div className="service-offer-detail"><span>{t.deliverablesLabel}</span><ul className="service-deliverable-list">{audit.deliverables.map((item) => <li key={item}><Check className="h-3.5 w-3.5" />{item}</li>)}</ul></div>
                <Link href={`${contactPath}?service=${audit.slug}&source=services_offer`} className="services-simple-cta">
                  <span>{t.offerCta}</span><ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="services-section services-process-section" aria-labelledby="process-title">
        <SectionHeading id="process-title" title={t.processSection} intro={t.processIntro} tone="secondary" />
        <ol className="service-process-grid">
          {t.process.map((step, index) => <li key={step.title} className="service-process-step"><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}
        </ol>
      </section>

      <section className="services-section" aria-labelledby="evidence-title">
        <SectionHeading id="evidence-title" title={t.evidenceSection} intro={t.evidenceIntro} tone="tertiary" />
        <div className="service-evidence-grid">
          {t.evidence.map((item) => <article key={item.title} className="service-evidence-card"><ShieldCheck className="h-5 w-5 text-tertiary" /><h3>{item.title}</h3><p>{item.description}</p>{item.href ? <Link href={item.href} className="cta-text inline-flex">{item.linkLabel} <ArrowRight className="h-4 w-4" /></Link> : null}</article>)}
        </div>
      </section>

      <section className="services-section" aria-labelledby="training-title">
        <SectionHeading id="training-title" title={t.trainingSection} intro={t.trainingIntro} tone="secondary" />
        <div className="service-training-grid">
          {t.training.map((program) => <article key={program.slug} className={`service-training-card ${toneClass(program.tone)}`}><h3>{program.title}</h3><div><span>{t.audienceLabel}</span><p>{program.audience}</p></div><div><span>{t.formatLabel}</span><p>{program.format}</p></div><div><span>{t.outcomeLabel}</span><p>{program.outcome}</p></div><Link href={`${contactPath}?service=${program.slug}&source=services_training`} className="cta-text inline-flex mt-auto">{t.trainingCta} <ArrowRight className="h-4 w-4" /></Link></article>)}
        </div>
      </section>

      <section className="services-closing" aria-labelledby="services-closing-title">
        <div><span className="font-mono text-primary uppercase tracking-[0.24em] text-[0.62rem]">Secure scope // next step</span><h2 id="services-closing-title">{t.closingTitle}</h2><p>{t.closingText}</p></div>
        <div><ul>{t.closingChecklist.map((item) => <li key={item}><Check className="h-4 w-4" />{item}</li>)}</ul><Link href={`${contactPath}?source=services_closing`} className="cta-primary inline-flex text-sm px-7 py-4 mt-7">{t.closingCta} <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
    </motion.div>
  );
}

function SectionHeading({ id, title, intro, tone }: { id: string; title: string; intro: string; tone: 'primary' | 'secondary' | 'tertiary' }) {
  return <div className="services-heading"><div className={`services-section-header ${tone === 'secondary' ? 'services-heading-secondary' : tone === 'tertiary' ? 'services-heading-tertiary' : ''}`}><span className="services-section-line"></span><h2 id={id} className="services-section-index">{title}</h2></div><p>{intro}</p></div>;
}
