function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function StructuredData({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
