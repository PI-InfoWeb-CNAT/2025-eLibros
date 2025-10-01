import { ItemCarrinho } from "./itemCarrinho";

export interface Carrinho {
  id: number;
  cliente: number;
  criado_em: string;
  atualizado_em: string;
  itens: ItemCarrinho[];
}