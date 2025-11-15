import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  perfil?: string;  // Mudado para string para aceitar '1'
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
  private readonly router = inject(Router); // Adicionado Router
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

  registrar(dto: UsuarioCreateDto): Observable<any> {
    const first = dto.enderecos?.[0];
    const req: RegisterRequest = {
      nome: dto.nome,
      email: dto.email,
      cpf: dto.cpf ?? null,
      telefone: dto.telefone ?? null,
      dataNascimento: dto.dataNascimento ?? null,
      perfil: '1', // Mudado para '1' (ID do perfil CLIENTE)
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
      tap({
        next: (res) => {
          alert('Cadastro realizado com sucesso! Verifique seu e-mail para a senha temporária.');
          // Redireciona para a home sem fazer login
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erro no cadastro:', err);
          const errorMessage = err?.error?.message || err?.message || 'Erro ao realizar cadastro. Tente novamente.';
          alert(`Erro: ${errorMessage}`);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    const usuario = this.getUsuario();

    const autenticado = !!usuario && (
      !!usuario.token || !!usuario.id
    );

    console.log('[AuthService.isAuthenticated]', {
      usuario,
      autenticado
    });

    return autenticado;
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