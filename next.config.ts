import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  allowedDevOrigins: [
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
  transpilePackages: ['motion'],
  turbopack: {}
};

export default nextConfig;
