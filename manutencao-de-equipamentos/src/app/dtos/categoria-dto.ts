export interface CategoriaRequestDTO {
  nome: string;
  descricao?: string | null;
  ativo?: boolean;
}

export interface CategoriaResponseDTO {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}
