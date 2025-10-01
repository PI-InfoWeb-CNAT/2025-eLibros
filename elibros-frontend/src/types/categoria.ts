export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

export interface CategoriaCreateInput {
  nome: string;
  descricao?: string;
}

export interface CategoriaUpdateInput {
  nome: string;
  descricao?: string;
}