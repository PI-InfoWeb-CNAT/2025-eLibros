export interface Livro {
  id: number;
  titulo: string;
  subtitulo?: string;
  autores: string[];
  editora: string;
  ISBN: string;
  data_de_publicacao?: string;
  ano_de_publicacao?: number;
  capa: string;
  sinopse?: string;
  generos: string[];
  categorias: string[];
  preco: string;
  desconto?: string;
  quantidade: number;
  qtd_vendidos: number;
}