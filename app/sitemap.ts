import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/markdown';
import { getProjectCaseStudies } from '@/lib/projects';
import { absoluteUrl, Locale, sitemapLanguagesFor } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const frPosts = getBlogPosts('fr');
  const enPosts = getBlogPosts('en');
  const frProjects = getProjectCaseStudies('fr');
  const enProjects = getProjectCaseStudies('en');

  const frBlogUrls = frPosts.map((post) => ({
    url: absoluteUrl('fr', `/blog/${post.slug}`),
    lastModified: new Date(post.updated || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: sitemapLanguagesFor(`/blog/${post.slug}`),
    },
  }));

  const enBlogUrls = enPosts.map((post) => ({
    url: absoluteUrl('en', `/blog/${post.slug}`),
    lastModified: new Date(post.updated || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: sitemapLanguagesFor(`/blog/${post.slug}`),
    },
  }));

  const projectUrls = [
    ...frProjects.map((project) => ({ locale: 'fr' as const, project })),
    ...enProjects.map((project) => ({ locale: 'en' as const, project })),
  ].map(({ locale, project }) => ({
    url: absoluteUrl(locale, `/projects/${project.slug}`),
    lastModified: new Date(project.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: { languages: sitemapLanguagesFor(`/projects/${project.slug}`) },
  }));

  const staticRouteEntries: Array<{ locale: Locale; path: string; priority: number }> = [
    { locale: 'fr', path: '/', priority: 1 },
    { locale: 'fr', path: '/services', priority: 0.8 },
    { locale: 'fr', path: '/contact', priority: 0.8 },
    { locale: 'fr', path: '/blog', priority: 0.8 },
    { locale: 'fr', path: '/projects', priority: 0.9 },
    { locale: 'en', path: '/', priority: 1 },
    { locale: 'en', path: '/services', priority: 0.8 },
    { locale: 'en', path: '/contact', priority: 0.8 },
    { locale: 'en', path: '/blog', priority: 0.8 },
    { locale: 'en', path: '/projects', priority: 0.9 },
  ];

  const staticRoutes = staticRouteEntries.map((route) => ({
    url: absoluteUrl(route.locale, route.path),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route.priority,
    alternates: {
      languages: sitemapLanguagesFor(route.path),
    },
  }));

  return [...staticRoutes, ...projectUrls, ...frBlogUrls, ...enBlogUrls];
}
