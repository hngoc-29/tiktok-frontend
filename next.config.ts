import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/sitemap/:page.xml",   // URL public
        destination: "/sitemap/:page",  // route thực sự trong app
      },
    ];
  },
};

export default nextConfig;
