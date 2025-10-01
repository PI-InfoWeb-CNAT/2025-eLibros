import { Usuario } from './usuario';
import { Endereco } from './endereco';

export interface Cliente {
  id: number;
  user: Usuario;
  endereco: Endereco | null;
  criado_por: number | null;
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
  endereco?: {
    cep?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    cidade?: string;
    estado?: string; // Note: API usa 'estado' mas model usa 'uf'
    bairro?: string;
  };
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