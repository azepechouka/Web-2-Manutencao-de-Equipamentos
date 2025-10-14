import { Endereco } from '../models/endereco.model';

export interface UsuarioCreateDto {
  nome: string;
  email: string;
  cpf?: string | null;
  telefone?: string | null;
  dataNascimento?: string | null;
  perfilId: number;
  enderecos: Endereco[];
}