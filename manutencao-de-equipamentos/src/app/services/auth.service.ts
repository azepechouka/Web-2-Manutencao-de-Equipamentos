import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Endereco } from '../models/endereco.model';

export type Perfil = 'FUNCIONARIO' | 'USUARIO';

export interface UsuarioLogado {
  id: string;
  nome: string;
  email?: string;
  perfis?: Perfil[];
  token?: string; // armazenamos o JWT aqui também
}

export interface RegisterRequest {
  cpf: string;
  nome: string;
  email: string;
  telefone?: string | null;
  endereco: Endereco;
  perfil?: 'CLIENTE' | 'FUNCIONARIO';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'auth.usuario';
  private readonly API = "http://localhost:8080";
  private readonly AUTH = `${this.API}/api/auth`;

  /**
   * Faz login na API Java e persiste o usuário + token no localStorage.
   * @param email
   * @param senha
   * @param perfil Opcional (se seu back exigir/envia perfil)
   */
  login(email: string, senha: string, perfil?: Perfil) {
  }

  /**
   * Registro de usuário via API Java.
   */
  registrar(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.AUTH}/register`, payload);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getUsuario()?.token;
  }

  getUsuario(): UsuarioLogado | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UsuarioLogado) : null;
  }

  getUsuarioId(): number | null {
    const usuario = this.getUsuario();
    if (!usuario?.id) return null;
    const parsed = Number(String(usuario.id).replace(/\D/g, ''));
    return Number.isNaN(parsed) ? null : parsed;
  }

  getPerfis(): Perfil[] {
    return this.getUsuario()?.perfis ?? [];
  }

  hasPerfil(perfil: Perfil): boolean {
    return this.getPerfis().includes(perfil);
  }

  // ====================== Privados ======================



  private persist(usuario: UsuarioLogado): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }
}