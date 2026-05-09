import type { Metadata } from 'next';
import type { BlogPostMeta } from '@/lib/markdown';

export type Locale = 'fr' | 'en';

export const siteUrl = 'https://rstride.fr';
export const siteName = 'Romain Stride';
export const defaultOgImage = `${siteUrl}/og-default.svg`;
export const defaultOgImageAlt = 'Romain Stride cybersecurity consultant portfolio';

export const locales: Locale[] = ['fr', 'en'];

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

const localePrefixes: Record<Locale, string> = {
  fr: '',
  en: '/en',
};

const ogLocales: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_US',
};

export const pageSeo = {
  home: {
    fr: {
      title: 'Consultant cybersécurité freelance | Romain Stride',
      description:
        'Pentests applicatifs, audits API et cloud, formations sécurité et write-ups offensifs pour transformer les risques techniques en actions concrètes.',
      path: '/',
    },
    en: {
      title: 'Freelance Cybersecurity Consultant | Romain Stride',
      description:
        'Web application pentests, API and cloud audits, security training, and offensive security write-ups that turn technical risk into concrete action.',
      path: '/',
    },
  },
  services: {
    fr: {
      title: 'Services de pentest et formation cybersécurité | Romain Stride',
      description:
        'Audits applicatifs, API, cloud, infrastructure interne et formations sécurité conçus pour produire des livrables exploitables par les équipes.',
      path: '/services',
    },
    en: {
      title: 'Pentest and Cybersecurity Training Services | Romain Stride',
      description:
        'Web application, API, cloud, internal infrastructure audits, and security training designed to produce actionable deliverables for teams.',
      path: '/services',
    },
  },
  blog: {
    fr: {
      title: 'Write-ups cybersécurité offensive | Romain Stride',
      description:
        'Write-ups techniques, analyses de vulnérabilités et notes de recherche en sécurité offensive sur web, API, cloud, Linux et exploitation.',
      path: '/blog',
    },
    en: {
      title: 'Offensive Security Write-ups | Romain Stride',
      description:
        'Technical write-ups, vulnerability analysis, and offensive security research notes on web, API, cloud, Linux, and exploitation topics.',
      path: '/blog',
    },
  },
  contact: {
    fr: {
      title: 'Contact pentest et audit cybersécurité | Romain Stride',
      description:
        'Contactez Romain Stride pour cadrer un pentest applicatif, un audit API ou cloud, une formation sécurité ou une collaboration technique.',
      path: '/contact',
    },
    en: {
      title: 'Contact for Pentest and Cybersecurity Audit | Romain Stride',
      description:
        'Contact Romain Stride to scope a web application pentest, API or cloud audit, security training, or technical collaboration.',
      path: '/contact',
    },
  },
  privacy: {
    fr: {
      title: 'Politique de confidentialité | Romain Stride',
      description: 'Politique de confidentialité du portfolio Romain Stride.',
      path: '/privacy',
    },
    en: {
      title: 'Privacy Policy | Romain Stride',
      description: 'Privacy policy for the Romain Stride portfolio.',
      path: '/privacy',
    },
  },
} as const;

export function localizedPath(locale: Locale, path: string): string {
  const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${localePrefixes[locale]}${normalizedPath}` || '/';
}

export function absoluteUrl(locale: Locale, path: string): string {
  const localized = localizedPath(locale, path);
  return localized === '/' ? siteUrl : `${siteUrl}${localized}`;
}

function assetUrl(url: string): string {
  return url.startsWith('http://') || url.startsWith('https://') ? url : `${siteUrl}${url}`;
}

export function alternatesFor(path: string, locale: Locale): NonNullable<Metadata['alternates']> {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      fr: absoluteUrl('fr', path),
      en: absoluteUrl('en', path),
      'x-default': absoluteUrl('fr', path),
    },
  };
}

export function sitemapLanguagesFor(path: string): Record<string, string> {
  return {
    fr: absoluteUrl('fr', path),
    en: absoluteUrl('en', path),
    'x-default': absoluteUrl('fr', path),
  };
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image = defaultOgImage,
  imageAlt = defaultOgImageAlt,
  noIndex = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(locale, path);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: alternatesFor(path, locale),
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale: ogLocales[locale],
      alternateLocale: locales.filter((candidate) => candidate !== locale).map((candidate) => ogLocales[candidate]),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function getPostSeo(post: BlogPostMeta) {
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.ogImage || defaultOgImage,
    imageAlt: post.ogImageAlt || `${post.title} article by ${siteName}`,
  };
}

export function buildArticleMetadata({
  locale,
  post,
}: {
  locale: Locale;
  post: BlogPostMeta;
}): Metadata {
  const seo = getPostSeo(post);
  const path = `/blog/${post.slug}`;
  const url = absoluteUrl(locale, path);

  return {
    metadataBase: new URL(siteUrl),
    title: `${seo.title} | ${siteName}`,
    description: seo.description,
    alternates: alternatesFor(path, locale),
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'article',
      url,
      siteName,
      authors: [post.author],
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      tags: post.tags,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((candidate) => candidate !== locale).map((candidate) => ogLocales[candidate]),
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 630,
          alt: seo.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: ['fr-FR', 'en-US'],
    description: pageSeo.home.fr.description,
    publisher: {
      '@id': `${siteUrl}/#person`,
    },
  };
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: siteName,
    url: siteUrl,
    jobTitle: ['Cybersecurity Consultant', 'Pentester', 'Security Researcher'],
    sameAs: ['https://github.com/rstride', 'https://linkedin.com/in/romainstride', 'https://prismasec.fr'],
    knowsAbout: [
      'Web application penetration testing',
      'API security',
      'Cloud security',
      'Offensive security',
      'Security training',
    ],
  };
}

export function professionalServiceJsonLd(locale: Locale) {
  const isFrench = locale === 'fr';

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#professional-service`,
    name: isFrench ? 'Romain Stride - Consultant cybersécurité' : 'Romain Stride - Cybersecurity Consultant',
    url: absoluteUrl(locale, '/services'),
    image: assetUrl(defaultOgImage),
    provider: {
      '@id': `${siteUrl}/#person`,
    },
    areaServed: isFrench ? 'France and remote engagements' : 'France and international remote engagements',
    serviceType: [
      'Web application penetration testing',
      'API security audit',
      'Cloud security audit',
      'Internal infrastructure audit',
      'Security training',
    ],
    availableLanguage: ['French', 'English'],
  };
}

export function articleJsonLd(post: BlogPostMeta, locale: Locale) {
  const seo = getPostSeo(post);
  const path = `/blog/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${absoluteUrl(locale, path)}#article`,
    headline: seo.title,
    description: seo.description,
    image: assetUrl(seo.image),
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@id': `${siteUrl}/#person`,
    },
    publisher: {
      '@id': `${siteUrl}/#person`,
    },
    mainEntityOfPage: absoluteUrl(locale, path),
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    keywords: post.tags.join(', '),
  };
}

export function breadcrumbJsonLd(locale: Locale, items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}
