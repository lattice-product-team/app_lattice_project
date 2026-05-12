import type { NextConfig } from 'next';

const nextConfig: any = {
  transpilePackages: ['@heroui/react', '@heroui/styles'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
