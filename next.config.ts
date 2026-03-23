import type {NextConfig} from 'next';

const isDevCommand = process.argv.includes('dev');

const nextConfig: NextConfig = {
  distDir: isDevCommand ? '.next-dev' : '.next',
  reactStrictMode: true,
  allowedDevOrigins: [
    '51.210.245.136',
    'localhost',
    '127.0.0.1',
    'rstride.fr',
    'www.rstride.fr',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
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
