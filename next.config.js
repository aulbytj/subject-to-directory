/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable full Next.js features
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Keep images unoptimized for simpler deployment
  images: { unoptimized: true },
};

module.exports = nextConfig;
