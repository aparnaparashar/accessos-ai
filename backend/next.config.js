/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      { source: "/v1/:path*", destination: "/api/v1/:path*" },
      { source: "/health/:path*", destination: "/api/health/:path*" },
      { source: "/health", destination: "/api/health" },
    ];
  },
};
module.exports = nextConfig;
