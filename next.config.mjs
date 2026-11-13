/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  devIndicators: false,
  async redirects() {
    return [{ source: "/install", destination: "/docs#quickstart", permanent: true }];
  },
};

export default nextConfig;
