import { Usuario } from './usuario';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Usuario;
  refresh: string;
  access: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  nome: string;
  CPF: string;
  telefone: string;
  genero?: string;
  dt_nasc?: string;
  password: string;
  password_confirm: string;
}
