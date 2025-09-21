import { Endereco } from "./endereco.model";

export interface Usuario {
  id: number;
  /** CPF único (somente dígitos) */
  cpf: string;
  nome: string;
  /** E-mail único e usado no login */
  email: string;
  /** Telefone de contato */
  telefone?: string | null;

  /** Endereço completo armazenado, mesmo vindo do ViaCEP */
  endereco: Endereco;

  perfil: 'CLIENTE' | 'FUNCIONARIO';
  ativo: boolean;
  criadoEm: string; // ISO date
}