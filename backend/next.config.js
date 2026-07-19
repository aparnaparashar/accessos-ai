/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Every route under src/app/api/* implements the routes documented in
  // Section 08/09 of the AccessOS AI Product & Technical Overview.

  // The Angular frontend (and the proxy.conf.json / nginx.conf in prod) call
  // /v1/* and /health* directly — but Next.js App Router mounts everything
  // under src/app/api/*, so the actual handlers live at /api/v1/* and
  // /api/health/*. These rewrites bridge the gap transparently.
  async rewrites() {
    return [
      { source: "/v1/:path*", destination: "/api/v1/:path*" },
      { source: "/health/:path*", destination: "/api/health/:path*" },
      { source: "/health", destination: "/api/health" },
    ];
  },
};
module.exports = nextConfig;
