import { Autor } from './autor';
import { Categoria } from './categoria';
import { GeneroLiterario } from './generoLiterario';

export interface Livro {
  id: number;
  titulo: string;
  subtitulo?: string;
  sinopse?: string;
  editora: string;
  ISBN?: string;
  capa?: string;
  data_de_publicacao?: string; // Matches Django serializer field
  ano_de_publicacao?: number;
  preco: string;
  desconto?: string;
  quantidade: number; // Matches Django serializer field
  qtd_vendidos?: number; // Matches Django serializer field
  autores: string[]; // StringRelatedField from Django
  categorias: string[]; // StringRelatedField from Django
  generos: string[]; // StringRelatedField from Django
}

export interface LivroCreateData {
  titulo: string;
  subtitulo?: string;
  sinopse?: string;
  editora: string;
  ISBN?: string;
  capa?: string;
  data_de_publicacao?: string; // Matches Django model field
  ano_de_publicacao?: number;
  preco: string;
  desconto?: string;
  quantidade: number; // Matches Django model field
  autor: number[];      // IDs dos autores (matches Django model field name)
  categoria: number[];   // IDs das categorias (matches Django model field name)
  genero: number[];      // IDs dos gêneros (matches Django model field name)
}

export interface LivroUpdateData extends Partial<LivroCreateData> {}

export interface LivroListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Livro[];
}