import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/markdown';
import { absoluteUrl, Locale, sitemapLanguagesFor } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const frPosts = getBlogPosts('fr');
  const enPosts = getBlogPosts('en');

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

  const staticRouteEntries: Array<{ locale: Locale; path: string; priority: number }> = [
    { locale: 'fr', path: '/', priority: 1 },
    { locale: 'fr', path: '/services', priority: 0.8 },
    { locale: 'fr', path: '/contact', priority: 0.8 },
    { locale: 'fr', path: '/blog', priority: 0.8 },
    { locale: 'en', path: '/', priority: 1 },
    { locale: 'en', path: '/services', priority: 0.8 },
    { locale: 'en', path: '/contact', priority: 0.8 },
    { locale: 'en', path: '/blog', priority: 0.8 },
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

  return [...staticRoutes, ...frBlogUrls, ...enBlogUrls];
}
