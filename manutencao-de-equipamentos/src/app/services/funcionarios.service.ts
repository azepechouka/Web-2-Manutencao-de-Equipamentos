// src/app/services/funcionarios.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Endereco } from '../models/endereco.model';
import { Perfil } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  private emptyEndereco(): Endereco {
    return {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: undefined,
      bairro: '',
      cidade: '',
      uf: '',
    };
  }

  private readonly perfilFuncionario: Perfil = { id: 2, nome: 'FUNCIONARIO' };

  private readonly _data$ = new BehaviorSubject<Usuario[]>([]);

  list$(): Observable<Usuario[]> {
    return this._data$.asObservable();
  }

  private getAll(): Usuario[] {
    return this._data$.getValue();
  }

  private setAll(arr: Usuario[]) {
    this._data$.next(arr);
  }

  private onlyFuncionarios(arr = this.getAll()): Usuario[] {
    return arr.filter(u => u.perfil?.nome === 'FUNCIONARIO' || u.perfil?.id === this.perfilFuncionario.id);
  }

  private nextId(): number {
    return Math.max(...this.getAll().map(f => f.id ?? 0), 0) + 1;
  }

  private normalizeEmail(email: string | null | undefined): string {
    return (email ?? '').trim().toLowerCase();
  }

  private normalizeNome(nome: string | null | undefined): string {
    return (nome ?? '').trim();
  }

  private emailExists(email: string, excludeId?: number): boolean {
    const normalized = this.normalizeEmail(email);
    return this.getAll().some(
      f => this.normalizeEmail(f.email) === normalized && f.id !== excludeId
    );
  }

  inserir(
    usuario: Pick<Usuario, 'email' | 'nome'> & Partial<Usuario>
  ): Observable<Usuario> {
    const email = this.normalizeEmail(usuario.email);
    const nome = this.normalizeNome(usuario.nome);

    if (!email) return throwError(() => new Error('E-mail é obrigatório.'));
    if (!nome) return throwError(() => new Error('Nome é obrigatório.'));
    if (this.emailExists(email)) return throwError(() => new Error('E-mail já está em uso.'));

    const agora = new Date().toISOString();

    const novo: Usuario = {
      id: this.nextId(),
      nome,
      email,
      cpf: usuario.cpf ?? '',
      telefone: usuario.telefone ?? undefined,
      enderecos: usuario.enderecos ?? [this.emptyEndereco()],
      perfil: usuario.perfil ?? this.perfilFuncionario,
      ativo: true,
      criadoEm: agora,
      atualizadoEm: agora,
      senhaSalt: '',
      senhaHash: '',
    };

    this.setAll([...this.getAll(), novo]);
    return of(novo).pipe(delay(150));
  }

  atualizar(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    const arr = this.getAll();
    const idx = arr.findIndex(f => f.id === id);
    if (idx < 0) return throwError(() => new Error('Funcionário não encontrado.'));

    const patch: Partial<Usuario> = { ...usuario };

    if (patch.email !== undefined) {
      const email = this.normalizeEmail(patch.email);
      if (!email) return throwError(() => new Error('E-mail é obrigatório.'));
      if (this.emailExists(email, id)) return throwError(() => new Error('E-mail já está em uso.'));
      patch.email = email;
    }

    if (patch.nome !== undefined) {
      const nome = this.normalizeNome(patch.nome);
      if (!nome) return throwError(() => new Error('Nome é obrigatório.'));
      patch.nome = nome;
    }

    delete (patch as any).id;
    delete (patch as any).perfil;
    delete (patch as any).criadoEm;
    delete (patch as any).senhaSalt;
    delete (patch as any).senhaHash;

    const atual = { ...arr[idx] } as Usuario;
    const atualizado: Usuario = {
      ...atual,
      ...patch,
      cpf: patch.cpf ?? atual.cpf ?? '',
      telefone: patch.telefone ?? atual.telefone ?? undefined,
      enderecos: patch.enderecos ?? atual.enderecos ?? [this.emptyEndereco()],
      perfil: atual.perfil,
      atualizadoEm: new Date().toISOString(),
      senhaSalt: atual.senhaSalt,
      senhaHash: atual.senhaHash,
    };

    const novoArr = [...arr];
    novoArr[idx] = atualizado;

    this.setAll(novoArr);
    return of(atualizado).pipe(delay(150));
  }

  remover(id: number, currentUserId: number): Observable<boolean> {
    const arr = this.getAll();
    const idx = arr.findIndex(f => f.id === id);
    if (idx < 0) return throwError(() => new Error('Funcionário não encontrado.'));

    const totalFuncionarios = this.onlyFuncionarios(arr).length;
    if (totalFuncionarios <= 1) {
      return throwError(() => new Error('Não é possível remover: existe apenas um funcionário no sistema.'));
    }
    if (id === currentUserId) {
      return throwError(() => new Error('Você não pode remover a si mesmo.'));
    }

    const novo = [...arr];
    novo.splice(idx, 1);
    this.setAll(novo);

    return of(true).pipe(delay(120));
  }
}
