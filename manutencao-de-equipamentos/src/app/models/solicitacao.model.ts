export interface Solicitacao {
  id: number;
  clienteId: number;
  equipamentoId?: number | null;
  descricaoEquipamento?: string | null;
  descricaoProblema: string;
  criadoEm: string;      // ISO date
  statusAtualId: number; // FK para StatusSolicitacao
  atualizadoEm: string;  // ISO date
}
