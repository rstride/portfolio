import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  allowedDevOrigins: ["localhost", "146.59.233.49"],
};

export default nextConfig;
