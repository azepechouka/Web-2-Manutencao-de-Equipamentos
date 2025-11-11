export interface HistoricoStatus {
  id: number;
  solicitacaoId: number;
  deStatusId?: number | null;
  paraStatusId: number;
  usuarioId?: number | null;
  observacao?: string | null;
  criadoEm: string;
}

export interface HistoricoStatusDTO {
  id: number;
  solicitacaoId: number;
  descricaoEquipamento: string;
  deStatusId?: number | null;
  paraStatusId: number;
  statusNome?: string | null;
  usuarioId?: number | null;
  nomeUsuario?: string | null;
  observacao?: string | null;
  criadoEm: string;
}
