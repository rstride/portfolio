import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ExternalLink, MapPin } from 'lucide-react';
import * as motion from 'motion/react-client';

import { StructuredData } from '@/components/structured-data';
import { homeContent } from '@/features/home/home-content';
import { servicesContent } from '@/features/services/services-content';
import { ServiceCategories } from '@/features/services/service-categories';
import { getBlogPosts } from '@/lib/markdown';
import { personJsonLd, professionalServiceJsonLd, type Locale } from '@/lib/seo';

const proofItems = {
  fr: [{ label: 'PT1 certifié', href: 'https://tryhackme.com/p/rstride' }, { label: 'HTB Elite Hacker', href: 'https://www.hackthebox.com/profile/106666' }, { label: 'École 42 Alumni' }, { label: 'Fondateur de PrismaSec', href: 'https://prismasec.fr' }, { label: 'Perpignan · Remote', icon: true }],
  en: [{ label: 'PT1 certified', href: 'https://tryhackme.com/p/rstride' }, { label: 'HTB Elite Hacker', href: 'https://www.hackthebox.com/profile/106666' }, { label: 'École 42 Alumni' }, { label: 'PrismaSec founder', href: 'https://prismasec.fr' }, { label: 'Perpignan · Remote', icon: true }],
} as const;

export function HomePage({ locale }: { locale: Locale }) {
  const t = homeContent[locale]; const services = servicesContent[locale]; const prefix = locale === 'en' ? '/en' : '';
  const posts = getBlogPosts(locale); const featured = posts.filter((post) => post.featured).slice(0, 3);
  const selectedPosts = [...featured, ...posts.filter((post) => !post.featured)].slice(0, 3);

  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <StructuredData data={personJsonLd()} /><StructuredData data={professionalServiceJsonLd(locale)} />
    <section className="home-hero"><div className="hero-frame"><span className="home-kicker">{t.kicker}</span><div className="home-hero-grid"><div><h1>{t.titleLead}<br /><span>{t.titleAccent}</span></h1><p>{t.intro}</p><div className="home-actions"><Link href={`${prefix}/contact?source=home_hero`} className="cta-primary inline-flex">{t.primaryCta}<ArrowRight className="size-4" /></Link><Link href={`${prefix}/services`} className="cta-secondary inline-flex">{t.secondaryCta}</Link></div></div><div className="home-hero-signal"><span>{locale === 'fr' ? 'Audits & formations' : 'Audits & training'}</span><strong>{locale === 'fr' ? 'Comprendre les risques. Renforcer les compétences.' : 'Understand the risks. Build stronger skills.'}</strong><small>{locale === 'fr' ? 'Des objectifs adaptés à votre entreprise' : 'Objectives shaped around your business'}</small></div></div></div></section>
    <section className="proof-strip" aria-label={t.proofLabel as string}><div className="page-frame proof-strip-inner"><span className="proof-strip-label">{t.proofLabel}</span><ul>{proofItems[locale].map((item) => <li key={item.label}>{'icon' in item && item.icon ? <MapPin className="size-3.5" /> : null}{'href' in item && item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}<ExternalLink className="size-3" /></a> : item.label}</li>)}</ul></div></section>
    <section className="home-section home-services-section"><div className="page-frame"><SectionIntro kicker={t.servicesKicker as string} title={t.servicesTitle as string} text={t.servicesText as string} /><ServiceCategories locale={locale} hrefPrefix={`${prefix}/services`} headingLevel="h3" /><Link href={`${prefix}/services`} className="cta-text inline-flex mt-8">{t.allServices}<ArrowRight className="size-4" /></Link></div></section>
    <section className="home-section home-process-section"><div className="page-frame"><SectionIntro kicker={t.processKicker as string} title={t.processTitle as string} /><ol className="home-process-grid">{services.process.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></div></section>
    <section className="home-section home-articles-section"><div className="page-frame"><SectionIntro kicker={t.articlesKicker as string} title={t.articlesTitle as string} text={t.articlesText as string} /><div className="home-article-grid">{selectedPosts.map((post) => <article key={post.slug}><span>{post.category || 'WRITEUP'}{' // '}{post.date}</span><h3>{post.title}</h3><p>{post.excerpt}</p><Link href={`${prefix}/blog/${post.slug}`}>{t.readArticle}<ArrowRight className="size-4" /></Link></article>)}</div><Link href={`${prefix}/blog`} className="cta-text inline-flex mt-8">{t.allArticles}<ArrowRight className="size-4" /></Link></div></section>
    <section className="home-section home-about-section"><div className="page-frame home-about-grid"><div className="home-about-portrait"><Image src="/rstride.webp" alt={locale === 'fr' ? 'Portrait de Romain Stride, consultant cybersécurité' : 'Portrait of Romain Stride, cybersecurity consultant'} fill sizes="(max-width: 1024px) min(70vw, 24rem), 24rem" className="object-cover" /></div><div><span className="home-kicker">{t.aboutKicker}</span><h2>{t.aboutTitle}</h2>{(t.aboutParagraphs as readonly string[]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<h3>{t.foundations}</h3><ul>{(t.foundationItems as readonly string[]).map((item) => <li key={item}><Check className="size-4" />{item}</li>)}</ul></div></div></section>
    <section className="home-final-cta"><div className="hero-frame"><h2>{t.finalTitle}</h2><p>{t.finalText}</p><Link href={`${prefix}/contact?source=home_final_cta`} className="cta-primary inline-flex">{t.finalCta}<ArrowRight className="size-4" /></Link></div></section>
  </motion.div>;
}

function SectionIntro({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return <div className="home-section-intro"><span className="home-kicker">{kicker}</span><h2>{title}</h2>{text ? <p>{text}</p> : null}</div>;
}
