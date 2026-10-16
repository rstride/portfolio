import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Code2, ExternalLink, ShieldCheck, Workflow } from 'lucide-react';

import { StructuredData } from '@/components/structured-data';
import { homeContent } from '@/features/home/home-content';
import { ServiceCategories } from '@/features/services/service-categories';
import { getBlogPosts } from '@/lib/markdown';
import { localizedPath, personJsonLd, type Locale } from '@/lib/seo';

const skillIcons = [Code2, ShieldCheck, Workflow];

export function HomePage({ locale }: { locale: Locale }) {
  const t = homeContent[locale];
  const posts = getBlogPosts(locale);
  const selectedPosts = [...posts.filter((post) => post.featured), ...posts.filter((post) => !post.featured)].slice(0, 3);

  return (
    <div className="portfolio-home">
      <StructuredData data={personJsonLd()} />
      <section className="home-hero hero-frame" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <span className="home-kicker">{t.kicker}</span>
          <h1 id="home-title">{t.title}<span>{t.specialty}</span></h1>
          <p className="home-intro">{t.intro}</p>
          <div className="home-actions">
            <Link href={localizedPath(locale, '/projects')} className="cta-primary inline-flex">{t.primaryCta}<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
          <div className="home-socials">
            <a href="https://github.com/rstride" target="_blank" rel="noopener noreferrer"><Code2 className="size-4" aria-hidden="true" />GitHub<ArrowUpRight className="size-3" aria-hidden="true" /></a>
            <a href="https://linkedin.com/in/romainstride" target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" aria-hidden="true" />LinkedIn<ArrowUpRight className="size-3" aria-hidden="true" /></a>
          </div>
          <div className="home-hero-foundations">{t.foundations.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
        <div className="home-hero-visual">
          <div className="home-portrait">
            <Image src="/rstride.webp" alt={t.portraitAlt} fill sizes="(max-width: 767px) 100px, (max-width: 1023px) 280px, 400px" loading="eager" className="object-cover" />
            <span className="home-portrait-caption" aria-hidden="true">ROMAIN_STRIDE // 42</span>
          </div>
        </div>
      </section>

      <section id="services" className="home-section home-services-section" aria-labelledby="services-title">
        <div className="page-frame">
          <SectionIntro id="services-title" kicker={t.servicesKicker} title={t.servicesTitle} text={t.servicesText} />
          <ServiceCategories locale={locale} hrefPrefix={localizedPath(locale, '/services')} headingLevel="h3" />
          <Link href={localizedPath(locale, '/services')} className="cta-text inline-flex mt-6">{t.allServices}<ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
      </section>

      <section id="skills" className="home-section home-skills-section" aria-labelledby="skills-title">
        <div className="page-frame">
          <SectionIntro id="skills-title" kicker={t.skillsKicker} title={t.skillsTitle} />
          <div className="home-skills-grid">{t.skills.map((skill, index) => {
            const Icon = skillIcons[index];
            return <article key={skill.title} className="home-skill-card">
              <div className="home-skill-marker"><Icon className="size-6" aria-hidden="true" /><span>0{index + 1}</span></div>
              <h3>{skill.title}</h3><p>{skill.description}</p>
              <ul className="project-tags" aria-label={locale === 'fr' ? 'Compétences' : 'Skills'}>{skill.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              <Link href={localizedPath(locale, skill.path)} className="portfolio-evidence">{skill.evidence}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </article>;
          })}</div>
        </div>
      </section>

      <section id="background" className="home-section home-background-section" aria-labelledby="background-title">
        <div className="page-frame home-background-grid">
          <SectionIntro id="background-title" kicker={t.aboutKicker} title={t.aboutTitle} />
          <ol className="home-journey">{t.journey.map((step) => <li key={step.title}><span className="home-kicker">{step.label}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
        </div>
      </section>

      <section className="home-section home-articles-section" aria-labelledby="articles-title">
        <div className="page-frame">
          <SectionIntro id="articles-title" kicker={t.articlesKicker} title={t.articlesTitle} text={t.articlesText} />
          <div className="home-article-grid">{selectedPosts.map((post) => <article key={post.slug}>
            <span>{post.category || 'WRITEUP'} / <time dateTime={post.date}>{new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.date))}</time></span>
            <h3>{post.title}</h3><p>{post.excerpt}</p><Link href={localizedPath(locale, `/blog/${post.slug}`)} className="portfolio-evidence">{t.readArticle}<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </article>)}</div>
          <Link href={localizedPath(locale, '/blog')} className="cta-text inline-flex mt-6">{t.allArticles}<ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="page-frame"><div><span className="home-kicker">{t.finalKicker}</span><h2>{t.finalTitle}</h2><p>{t.finalText}</p></div><Link href={`${localizedPath(locale, '/contact')}?source=home_final_cta`} className="cta-primary inline-flex">{t.finalCta}<ArrowUpRight className="size-4" aria-hidden="true" /></Link></div>
      </section>
    </div>
  );
}

function SectionIntro({ id, kicker, title, text }: { id: string; kicker: string; title: string; text?: string }) {
  return <div className="home-section-intro"><span className="home-kicker">{kicker}</span><h2 id={id}>{title}</h2>{text && <p>{text}</p>}</div>;
}
