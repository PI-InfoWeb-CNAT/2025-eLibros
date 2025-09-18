// Utilitário para normalizar URLs de imagens da API
// src/utils/imageUtils.ts

export function normalizeImageUrl(url: string | null | undefined): string {
  // Se não há URL, retornar placeholder
  if (!url) {
    return 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
  }

  // Se já é uma URL completa (começa com http/https), retornar como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Se é um caminho relativo, construir URL completa
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev/api/v1';
  
  // Remove /api/v1 do final para pegar apenas o domínio base
  const baseUrl = API_BASE_URL.replace('/api/v1', '');
  
  // Se a URL começa com /, adicionar apenas o domínio
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  
  // Caso contrário, adicionar o caminho completo
  return `${baseUrl}/${url}`;
}

export function getImageProps(src: string | null | undefined, alt: string) {
  return {
    src: normalizeImageUrl(src),
    alt,
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
    },
  };
}