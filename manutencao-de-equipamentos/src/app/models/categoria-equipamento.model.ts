export type CategoriaEquipamento = {
  id: number;
  nome: string;
  descricao?: string|null;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
};