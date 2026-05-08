import type { NextConfig } from 'next';

const nextConfig: any = {
  transpilePackages: ['@heroui/react', '@heroui/styles'],
  basePath: '/lattice/web-admin',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
