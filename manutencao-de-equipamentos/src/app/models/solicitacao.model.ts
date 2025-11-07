import { CategoriaEquipamento } from "./categoria-equipamento.model";

export interface Solicitacao {
  id: number;
  clienteId: number;
  descricaoEquipamento: string;
  descricaoDefeito: string;
  criadoEm: string;
  statusAtualId: number;
  atualizadoEm: string;
  equipamentoId?: number;
  categoriaEquipamento?: CategoriaEquipamento;
}


export interface SolicitacaoCreateDto {
  clienteId: number;
  descricaoEquipamento: string;
  descricaoDefeito: string;
  criadoEm: string;
  atualizadoEm: string;
  statusAtualId: number;
  equipamentoId?: number;
}
