import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Reduce JS shipped; this is a single-page waitlist.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;