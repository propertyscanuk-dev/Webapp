/** @type {import('next').NextConfig} */
// Build: 2026-06-03
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://udnswhcbgxhyhfsktvgq.supabase.co",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer", "stripe"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
