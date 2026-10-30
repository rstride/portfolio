import type { Metadata } from 'next';
import type { BlogPostMeta } from '@/lib/markdown';
import type { ProjectCaseStudyMeta } from '@/lib/projects';

export type Locale = 'fr' | 'en';

export const siteUrl = 'https://rstride.fr';
export const siteName = 'Romain Stride';
export const defaultOgImage = `${siteUrl}/og-default.png`;
export const defaultOgImageAlt = 'Romain Stride development and cybersecurity portfolio';

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
      title: 'Romain Stride — Développement & cybersécurité',
      description:
        'Développement logiciel, sécurité offensive et ingénierie des systèmes. Découvrez PrismaSec, mon parcours à l’École 42 et mes recherches web/API.',
      path: '/',
    },
    en: {
      title: 'Romain Stride — Development & Cybersecurity',
      description:
        'Software development, offensive security, and systems engineering. Explore PrismaSec, my École 42 background, and my web/API research.',
      path: '/',
    },
  },
  projects: {
    fr: {
      title: 'Projets développement & sécurité | Romain Stride',
      description: 'Découvrez PrismaSec, les journées cybersécurité de 42 Perpignan et KFS, mon noyau x86 en Rust : développement, transmission et ingénierie sécurité.',
      path: '/projects',
      image: '/projects/prismasec-og.png',
      imageAlt: 'PrismaSec : développement et ingénierie sécurité',
    },
    en: {
      title: 'Development & Security Projects | Romain Stride',
      description: 'Explore PrismaSec, the 42 Perpignan Cybersecurity Days, and KFS, my Rust x86 kernel: software development, knowledge sharing, and security engineering.',
      path: '/projects',
      image: '/projects/prismasec-og.png',
      imageAlt: 'PrismaSec: development and security engineering',
    },
  },
  services: {
    fr: {
      title: 'Services de pentest et formation cybersécurité | Romain Stride',
      description:
        'Audits de sécurité des applications, API, cloud et réseaux. Sensibilisation, formations techniques et ateliers pratiques adaptés à vos équipes.',
      path: '/services',
    },
    en: {
      title: 'Pentest and Cybersecurity Training Services | Romain Stride',
      description:
        'Application, API, cloud, and network security audits. Security awareness, technical training, and hands-on workshops suited to your teams.',
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
      title: 'Contact — Pentest & développement | Romain Stride',
      description:
        'Contactez Romain Stride pour un poste en pentest ou en développement full-stack, une collaboration technique, un audit de sécurité ou une formation.',
      path: '/contact',
    },
    en: {
      title: 'Contact — Pentesting & Development | Romain Stride',
      description:
        'Contact Romain Stride about a pentesting or full-stack development role, technical collaboration, security audit, or training.',
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

export function buildProjectMetadata(locale: Locale, project: ProjectCaseStudyMeta): Metadata {
  return buildPageMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: project.seoTitle || `${project.title} | ${siteName}`,
    description: project.seoDescription || project.summary,
    image: project.ogImage || defaultOgImage,
    imageAlt: project.coverAlt,
  });
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
    jobTitle: ['Software Developer', 'Cybersecurity Consultant', 'Pentester', 'PrismaSec Founder'],
    sameAs: ['https://github.com/rstride', 'https://linkedin.com/in/romainstride', 'https://prismasec.fr'],
    knowsAbout: [
      'Software development',
      'Security engineering',
      'Systems programming',
      'Web application penetration testing',
      'API security',
      'Full-stack development',
      'TypeScript',
      'Next.js',
      'Rust',
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
