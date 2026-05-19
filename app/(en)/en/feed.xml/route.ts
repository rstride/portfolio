import { getBlogPosts } from '@/lib/markdown';

export async function GET() {
  const posts = getBlogPosts('en');
  
  const siteUrl = 'https://rstride.fr';

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Romain Stride // Security Logs</title>
      <link>${siteUrl}/en</link>
      <description>Offensive security write-ups, vulnerability analysis, and research notes.</description>
      <language>en</language>
      <atom:link href="${siteUrl}/en/feed.xml" rel="self" type="application/rss+xml" />
      ${posts
        .map(
          (post) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${siteUrl}/en/blog/${post.slug}</link>
          <guid isPermaLink="true">${siteUrl}/en/blog/${post.slug}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description><![CDATA[${post.excerpt}]]></description>
          ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
        </item>
      `
        )
        .join('')}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
