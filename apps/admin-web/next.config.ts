import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/lattice/web-admin' : '';

const nextConfig: any = {
  basePath,
  assetPrefix: basePath,
  trailingSlash: false,
  transpilePackages: ['@heroui/react', '@heroui/styles', 'lucide-react'],
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    if (!basePath) return [];
    return [
      {
        source: '/',
        destination: basePath,
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
