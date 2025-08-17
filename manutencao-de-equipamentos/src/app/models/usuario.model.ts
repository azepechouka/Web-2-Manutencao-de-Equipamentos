export interface Usuario {
  id: number;
  nome: string;
  email?: string | null;
  perfil: 'CLIENTE' | 'FUNCIONARIO';
  ativo: boolean;
  criadoEm: string; // ISO date
}