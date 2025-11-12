export interface Orcamento {
  id: number;
  solicitacaoId: number;
  valor: number;
  observacao?: string | null;
  criadoEm: string;
}