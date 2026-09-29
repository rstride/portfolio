import type {NextConfig} from 'next';
import { securityHeaders } from './lib/security-headers';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  allowedDevOrigins: [
    '169.254.2.179',
    '51.210.245.136',
    'localhost',
    '127.0.0.1',
    'rstride.fr',
    'www.rstride.fr',
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  outputFileTracingIncludes: {
    '/*': ['./content/blog/**/*'],
  },
  transpilePackages: ['motion'],
  turbopack: {}
};

export default nextConfig;
