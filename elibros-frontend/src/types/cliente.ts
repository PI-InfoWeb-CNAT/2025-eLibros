import { Usuario } from './usuario';
import { Endereco } from './endereco';

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  username: string;
  cpf?: string;
  telefone?: string;
  data_nascimento?: string;
  genero?: string;
  data_cadastro: string;
  is_active: boolean;
  foto_de_perfil?: string | null;
  endereco?: {
    id: number;
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  } | null;
  // Mantendo compatibilidade com estrutura antiga
  user: Usuario;
}

export interface ClienteUpdateData {
  user?: {
    username?: string;
    email?: string;
    nome?: string;
    CPF?: string;
    telefone?: string;
    genero?: 'F' | 'M' | 'NB' | 'PND' | 'NI';
    dt_nasc?: string;
  };
  endereco?: Partial<Endereco> | null;
}

export interface ClienteListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Cliente[];
}

export interface ClienteStats {
  total_clientes: number;
  clientes_ativos: number;
  clientes_inativos: number;
  clientes_com_endereco: number;
  clientes_sem_endereco: number;
}