export interface Equipamento {
  id: number;
  clienteId: number;
  descricao: string;
  modelo?: string | null;
  numeroSerie?: string | null;
  criadoEm: string; // ISO date
}
