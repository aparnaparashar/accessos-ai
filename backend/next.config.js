/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bridges public specs routes to Next.js App Router endpoints under src/app/api/*
  async rewrites() {
    return [
      { source: "/v1/:path*", destination: "/api/v1/:path*" },
      { source: "/health/:path*", destination: "/api/health/:path*" },
      { source: "/health", destination: "/api/health" },
      { source: "/ocr", destination: "/api/v1/ocr" },
      { source: "/vision", destination: "/api/v1/vision" },
      { source: "/simplify", destination: "/api/v1/simplify" },
      { source: "/accessibility", destination: "/api/v1/accessibility" },
      { source: "/sign-language", destination: "/api/v1/sign-language" },
      { source: "/demo/:path*", destination: "/api/v1/demo/:path*" },
      { source: "/projects/:path*", destination: "/api/v1/projects/:path*" },
      { source: "/projects", destination: "/api/v1/projects" },
      { source: "/developer/:path*", destination: "/api/v1/developer/:path*" },
      { source: "/auth/:path*", destination: "/api/v1/auth/:path*" },
    ];
  },
};
module.exports = nextConfig;
