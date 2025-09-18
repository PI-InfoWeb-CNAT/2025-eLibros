import type { NextConfig } from "next";

// Configuração dinâmica para Codespaces
const getImageConfig = () => {
  const patterns = [
    // Configuração para desenvolvimento local
    {
      protocol: 'http' as const,
      hostname: 'localhost',
      port: '8000',
      pathname: '/media/**',
    },
    // Placehold para imagens de placeholder
    {
      protocol: 'https' as const,
      hostname: 'placehold.co',
      port: '',
      pathname: '/**',
    },
  ];

  // Se estivermos no Codespaces, adicionar o hostname atual
  if (process.env.CODESPACE_NAME) {
    patterns.unshift({
      protocol: 'https' as const,
      hostname: `${process.env.CODESPACE_NAME}-8000.app.github.dev`,
      port: '',
      pathname: '/media/**',
    });
  }

  // Hostnames conhecidos do Codespaces (fallback)
  const knownCodespaceHosts = [
    'bug-free-train-qr595jrgp59fx76g-8000.app.github.dev',
    'zany-engine-j6p4pv6wqjp25r54-8000.app.github.dev',
  ];

  knownCodespaceHosts.forEach(hostname => {
    patterns.push({
      protocol: 'https' as const,
      hostname,
      port: '',
      pathname: '/media/**',
    });
  });

  return patterns;
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: getImageConfig(),
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
