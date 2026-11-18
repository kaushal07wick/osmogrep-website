/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  devIndicators: false,
  outputFileTracingIncludes: { '/changelog': ['./public/changelog.json'], '/api/search': ['./public/changelog.json'] },
  async redirects() {
    return [{ source: "/install", destination: "/docs/cli#install", permanent: true }];
  },
};

export default nextConfig;
