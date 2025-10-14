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

interface AuthResponse {
  id: number | string;
  nome: string;
  email?: string;
  perfil?: string;     // 'USER' | 'ADMIN'
  token?: string;
  mensagem?: string;
}

interface RegisterRequest {
  nome: string;
  email: string;
  cpf?: string | null;
  telefone?: string | null;
  dataNascimento?: string | null;
  perfil?: 'USER' | 'ADMIN';
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string | null;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'auth.usuario';
  private readonly API = 'http://localhost:8080';
  private readonly AUTH = `${this.API}/api/auth`;

  login(email: string, senha: string): Observable<UsuarioLogado> {
    return this.http.post<AuthResponse>(`${this.AUTH}/login`, { email, senha }).pipe(
      map(res => ({
        id: String(res?.id ?? ''),
        nome: String(res?.nome ?? ''),
        email: res?.email ?? undefined,
        perfis: (res?.perfil?.toUpperCase() === 'ADMIN') ? (['FUNCIONARIO'] as Perfil[]) : (['USUARIO'] as Perfil[]),
        token: res?.token
      })),
      tap(user => this.persist(user))
    );
  }

  registrar(dto: UsuarioCreateDto): Observable<UsuarioLogado> {
    const first = dto.enderecos?.[0];
    const req: RegisterRequest = {
      nome: dto.nome,
      email: dto.email,
      cpf: dto.cpf ?? null,
      telefone: dto.telefone ?? null,
      dataNascimento: dto.dataNascimento ?? null,
      perfil: 'USER',
      endereco: {
        cep: first?.cep ?? '',
        logradouro: first?.logradouro ?? '',
        numero: first?.numero ?? '',
        complemento: first?.complemento ?? null,
        bairro: first?.bairro ?? '',
        cidade: first?.cidade ?? '',
        uf: first?.uf ?? ''
      }
    };

    return this.http.post<AuthResponse>(`${this.AUTH}/register`, req).pipe(
      map(res => ({
        id: String(res?.id ?? ''),
        nome: String(res?.nome ?? ''),
        email: res?.email ?? undefined,
        perfis: (res?.perfil?.toUpperCase() === 'ADMIN') ? (['FUNCIONARIO'] as Perfil[]) : (['USUARIO'] as Perfil[]),
        token: res?.token
      })),
      tap(user => this.persist(user))
    );
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
