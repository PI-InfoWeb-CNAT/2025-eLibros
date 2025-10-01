export interface Cupom {
  id: number;
  codigo: string;
  valor: number;
  tipo_valor: '1' | '2'; // '1' = porcentagem, '2' = decimal
  ativo: boolean;
  data_inicio: string;
  data_fim: string;
  criado_por: number | null;
}

export interface CupomCreateData {
  codigo: string;
  valor: number;
  tipo_valor: '1' | '2';
  ativo?: boolean;
  data_inicio: string;
  data_fim: string;
}

export interface CupomUpdateData extends Partial<CupomCreateData> {}

export interface CupomListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Cupom[];
}

export interface CupomStats {
  total_cupons: number;
  cupons_ativos: number;
  cupons_inativos: number;
  cupons_porcentagem: number;
  cupons_valor_fixo: number;
}