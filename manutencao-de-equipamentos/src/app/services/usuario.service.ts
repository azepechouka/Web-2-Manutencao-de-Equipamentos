import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { UsuarioResponse } from '../models/usuario.model';


@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly API = 'http://localhost:8080/api';
  private readonly USUARIOS = `${this.API}/usuarios`;

  listAll(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.USUARIOS);
  }

  getById(id: number): Observable<UsuarioResponse> {
    if (!id) return of({} as UsuarioResponse);
    return this.http.get<UsuarioResponse>(`${this.USUARIOS}/${id}`);
  }

  getUsuarioAtual(): Observable<UsuarioResponse> {
    const usuarioId = this.auth.getUsuarioId();
    if (!usuarioId) throw new Error('Nenhum usuário autenticado.');
    return this.getById(usuarioId);
  }
}
