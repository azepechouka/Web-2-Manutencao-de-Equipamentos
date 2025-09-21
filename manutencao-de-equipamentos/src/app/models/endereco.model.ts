export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  localidade: string; // cidade
  uf: string;
}
