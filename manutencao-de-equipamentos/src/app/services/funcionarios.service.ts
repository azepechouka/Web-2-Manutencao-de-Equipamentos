import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

type FuncionarioResponse = {
  id: number;
  email: string;
  nome: string;
  dataNascimento: string;
  perfil?: string | null;
};

type NovoFuncionarioDTO = {
  nome: string;
  email: string;
  dataNascimento: string;
  senha: string;
};

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  private http = inject(HttpClient);
  private readonly api = 'http://localhost:8080';
  private readonly base = `${this.api}/api/usuarios/funcionarios`;

  list$(): Observable<Usuario[]> {
    return this.http.get<FuncionarioResponse[]>(this.base).pipe(
      map(rows =>
        rows.map(r => ({
          id: r.id,
          email: r.email,
          nome: r.nome,
          criadoEm: undefined,
          atualizadoEm: undefined,
          ativo: true,
          perfil: r.perfil ? { id: undefined as any, nome: r.perfil } : undefined,
        } as unknown as Usuario))
      )
    );
  }

  inserir(dto: NovoFuncionarioDTO): Observable<FuncionarioResponse> {
    return this.http.post<FuncionarioResponse>(this.base, dto);
  }
}
