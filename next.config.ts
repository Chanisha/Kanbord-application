import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@/components"],
  },
  // Suppress hydration warnings for development
  reactStrictMode: true,
  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
