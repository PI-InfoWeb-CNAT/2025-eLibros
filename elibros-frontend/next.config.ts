import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zany-engine-j6p4pv6wqjp25r54-8000.app.github.dev',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Em desenvolvimento, reduzir warnings de hidratação
  ...(process.env.NODE_ENV === 'development' && {
    eslint: {
      ignoreDuringBuilds: false,
    },
    typescript: {
      ignoreBuildErrors: false,
    },
  }),
};

export default nextConfig;
