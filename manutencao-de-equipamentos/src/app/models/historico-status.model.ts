export interface HistoricoStatus {
  id: number;
  solicitacaoId: number;
  deStatusId?: number | null;
  paraStatusId: number;
  usuarioId?: number | null;
  observacao?: string | null;
  criadoEm: string;
}