import { Injectable } from '@angular/core';

export type Perfil = 'FUNCIONARIO' | 'USUARIO';

export interface UsuarioLogado {
  id: string;
  nome: string;
  email?: string;
  perfis?: Perfil[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'auth.usuario';

  /** Login fake: aceita qualquer email/senha não vazios e salva no localStorage */
  login(email: string, senha: string, perfil: Perfil): UsuarioLogado {
    // validações mínimas (fake)
    if (!email || !senha) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    const mockName = perfil === 'FUNCIONARIO' ? 'Funcionário Teste' : 'Usuário Teste';
    const usuario: UsuarioLogado = {
      id: this.generateId(perfil),
      nome: mockName,
      email,
      perfis: [perfil],
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
    return usuario;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getUsuario(): UsuarioLogado | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UsuarioLogado) : null;
  }

  getUsuarioId(): number | null {
    const usuario = this.getUsuario();
    if (!usuario?.id) return null;

    const parsed = Number(usuario.id.replace(/\D/g, '')); // remove letras e pega só números
    return isNaN(parsed) ? null : parsed;
  }

  getPerfis(): Perfil[] {
    return this.getUsuario()?.perfis ?? [];
  }

  hasPerfil(perfil: Perfil): boolean {
    return this.getPerfis().includes(perfil);
  }

  private generateId(perfil: Perfil): string {
    const prefix = perfil === 'FUNCIONARIO' ? 'F' : 'U';
    // id fake só para diferenciar sessões
    return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
}
