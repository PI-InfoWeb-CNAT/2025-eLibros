export interface ItemCarrinho {
  id: number;
  livro: {
    id: number;
    titulo: string;
    capa: string;
    preco: string;
    autores: string[];
  };
  quantidade: number;
}