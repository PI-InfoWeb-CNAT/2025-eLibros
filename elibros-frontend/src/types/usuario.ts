export interface Usuario {
  id: number;
  email: string;
  username: string;
  nome: string;
  CPF: string;
  telefone: string;
  genero: 'F' | 'M' | 'NB' | 'PND' | 'NI';
  dt_nasc?: string;
  date_joined: string;
  is_active: boolean;
  email_is_verified: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  foto_de_perfil?: string;
}
