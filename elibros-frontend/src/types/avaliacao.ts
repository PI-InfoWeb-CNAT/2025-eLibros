export interface Avaliacao {
  id: number;
  texto: string;
  curtidas: number;
  data_publicacao: string;
  usuario_nome: string;
  usuario_id: number;
  usuario_username: string;
  livro: number;
  livro_titulo: string;
  pode_curtir: boolean;
  usuario_curtiu: boolean;
}

export interface AvaliacaoCreateRequest {
  texto: string;
}
