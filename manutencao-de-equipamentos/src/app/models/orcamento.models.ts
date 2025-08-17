export interface Orcamento {
  id: number;
  solicitacaoId: number;
  valorTotal: number;
  moeda: string;             // ex.: 'BRL'
  observacao?: string | null;
  criadoEm: string;          // ISO date
}