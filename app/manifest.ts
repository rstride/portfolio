import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Romain Stride — Pentester & Full-stack Developer',
    short_name: 'Romain Stride',
    description: 'Romain Stride’s portfolio: web and API pentesting, full-stack development, and technical articles.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0e12',
    theme_color: '#0c0e12',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
