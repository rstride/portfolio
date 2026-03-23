import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://rstride.fr';
  
  const frPosts = getBlogPosts('fr');
  const enPosts = getBlogPosts('en');

  const frBlogUrls = frPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const enBlogUrls = enPosts.map((post) => ({
    url: `${siteUrl}/en/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/contact',
    '/blog',
    '/privacy',
    '/en',
    '/en/about',
    '/en/services',
    '/en/contact',
    '/en/blog',
    '/en/privacy',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' || route === '/en' ? 1 : 0.8,
  }));

  return [...staticRoutes, ...frBlogUrls, ...enBlogUrls];
}
