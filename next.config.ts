import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  output: 'standalone',

  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  allowedDevOrigins: ["localhost", "146.59.233.49"],
};

export default nextConfig;
