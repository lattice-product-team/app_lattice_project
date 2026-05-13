import type { NextConfig } from 'next';

const nextConfig: any = {
  transpilePackages: ['@heroui/react', '@heroui/styles', 'lucide-react'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
