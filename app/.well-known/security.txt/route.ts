const ONE_YEAR_IN_SECONDS = 31_536_000;

export const dynamic = 'force-static';

export function GET() {
  const expires = new Date(Date.now() + ONE_YEAR_IN_SECONDS * 1000).toISOString();
  const body = [
    'Contact: mailto:contact@rstride.fr',
    `Expires: ${expires}`,
    'Preferred-Languages: fr, en',
    'Canonical: https://rstride.fr/.well-known/security.txt',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
