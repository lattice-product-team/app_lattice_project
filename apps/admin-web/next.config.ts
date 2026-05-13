import type { NextConfig } from 'next';

const nextConfig: any = {
  basePath: process.env.NODE_ENV === 'production' ? '/lattice/web-admin' : undefined,
  transpilePackages: ['@heroui/react', '@heroui/styles', 'lucide-react'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
