import { CategoriaEquipamento } from "./categoria-equipamento.model";

export interface Solicitacao {
  id: number;
  clienteId: number;
  descricaoEquipamento: string;
  descricaoProblema: string;
  criadoEm: string;
  statusAtualId: number;
  atualizadoEm: string;
  equipamentoId?: number;
  categoriaEquipamento?: CategoriaEquipamento;
}
