export interface HistoricoStatus {
  id: number;
  solicitacaoId: number;
  deStatusId?: number | null;
  paraStatusId: number;
  usuarioId?: number | null;   // funcionário/cliente que mudou o status
  observacao?: string | null;
  criadoEm: string;            // ISO date
}