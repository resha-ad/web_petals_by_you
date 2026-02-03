import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",
        pathname: "/uploads/**",
      },
    ],
  },

  // This is the correct way in Next.js 14–16
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // or "5mb", "15mb" — 10mb is usually safe for profile photos
    },
  },
};

export default nextConfig;