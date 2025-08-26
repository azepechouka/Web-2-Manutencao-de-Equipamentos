export interface Solicitacao {
  id: number;
  clienteId: number;
  descricaoEquipamento: string;
  descricaoProblema: string;
  criadoEm: Date; // ou string, conforme seu uso
  statusAtualId: number;
  atualizadoEm: string;
  equipamentoId?: number;
}
