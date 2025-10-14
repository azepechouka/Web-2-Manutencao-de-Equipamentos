import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UsuarioCreateDto } from '../dtos/usuario-create.dto';

export type Perfil = 'FUNCIONARIO' | 'USUARIO';

export interface UsuarioLogado {
  id: string;
  nome: string;
  email?: string;
  perfis?: Perfil[];
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'auth.usuario';
  private readonly API = 'http://localhost:8080';
  private readonly AUTH = `${this.API}/api/auth`;
  private readonly USERS = `${this.API}/api/usuarios`;

  login(email: string, senha: string, perfil?: Perfil): Observable<UsuarioLogado> {
    return this.http.post<any>(`${this.AUTH}/login`, { email, senha, perfil }).pipe(
      map(res => ({
        id: String(res?.id ?? ''),
        nome: String(res?.nome ?? ''),
        email: res?.email ?? undefined,
        perfis: (res?.perfis ?? []) as Perfil[],
        token: res?.token ?? undefined
      })),
      tap(user => this.persist(user))
    );
  }

  registrar(payload: UsuarioCreateDto): Observable<void> {
    return this.http.post<void>(this.USERS, payload);
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

  private persist(usuario: UsuarioLogado): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }
}
