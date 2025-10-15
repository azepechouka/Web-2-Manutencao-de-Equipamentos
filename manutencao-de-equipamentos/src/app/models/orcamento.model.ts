export interface Orcamento {
  id: number;
  solicitacaoId: number;
  valorTotal: number;
  moeda: string;
  observacao?: string | null;
  criadoEm: string;
}