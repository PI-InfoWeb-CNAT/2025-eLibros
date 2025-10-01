import { Cliente } from "./cliente";
import { ItemCarrinho } from "./itemCarrinho";
import { Endereco } from "./endereco";

/*
TipoStatus{
PRO - Em processamento
CAN - Cancelado
CON - Confirmado
ENV - Enviado
ENT - Entregue
}
*/

export interface Pedido {
    numero_pedido : string;
    cliente : Cliente;
    itens : ItemCarrinho[];
    endereco : Endereco;
    status : string;
    data_de_pedido: string;
    entrega_estimada: string;
    data_de_entrega: string | null;
    valor_total: number;
    desconto: number;
    quantia_itens: number;
    data_de_cancelamento: string | null;
}

export interface PedidoCreateData {
    cliente_id: number;
    endereco_id: number;
    itens: {
        livro_id: number;
        quantidade: number;
    }[];
}

export interface PedidoUpdateData extends Partial<PedidoCreateData> {
    status?: 'PRO' | 'CAN' | 'CON' | 'ENV' | 'ENT';
}

export interface PedidoListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pedido[];
}

export interface PedidoStats {
    total_pedidos: number;
    pedidos_entregues: number;
    pedidos_cancelados: number;
    valor_total_vendido: number;
    media_valor_pedido: number;
}