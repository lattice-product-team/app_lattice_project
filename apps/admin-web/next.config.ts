import type { NextConfig } from 'next';

const nextConfig: any = {
  transpilePackages: ['@heroui/react', '@heroui/styles'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
