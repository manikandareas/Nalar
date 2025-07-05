import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Configure React
  reactStrictMode: true,

  // We're handling math rendering with our custom MathRenderer component
  // so we don't need to modify the Next.js configuration
  images: {
    domains: [
      "api.microlink.io", // Microlink Image Preview
    ],
  },
};

export default nextConfig;
