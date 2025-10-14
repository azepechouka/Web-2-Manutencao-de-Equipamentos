export interface Endereco {
  id?: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  usuarioId?: number;
  criadoEm?: string;
  atualizadoEm?: string;
}
