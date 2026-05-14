import type { NextConfig } from 'next';

const nextConfig: any = {
  basePath: '/lattice/web-admin',
  assetPrefix: '/lattice/web-admin',
  trailingSlash: false,
  transpilePackages: ['@heroui/react', '@heroui/styles', 'lucide-react'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
