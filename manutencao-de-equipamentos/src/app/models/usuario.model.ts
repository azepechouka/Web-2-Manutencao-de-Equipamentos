import { Endereco } from './endereco.model';
import { Perfil } from './perfil.model';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  perfil: Perfil;
  senhaSalt: string;
  senhaHash: string;
  ativo: boolean;
  enderecos: Endereco[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  perfil?: string;
  ativo?: boolean;
  dataNascimento?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}