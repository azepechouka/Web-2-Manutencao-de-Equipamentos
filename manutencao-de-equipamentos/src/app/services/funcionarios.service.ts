// src/app/services/funcionarios.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators'; // ✅ operador delay
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' }) // ✅ registra o service no root injector
export class FuncionariosService {
  private readonly _data$ = new BehaviorSubject<Usuario[]>([
    { id: 1,  nome: 'João da Silva',  email: 'joao@empresa.com',  perfil: 'FUNCIONARIO', ativo: true, criadoEm: '2025-01-01T09:00:00-03:00' },
    { id: 10, nome: 'Maria Souza',    email: 'maria@empresa.com', perfil: 'FUNCIONARIO', ativo: true, criadoEm: '2025-01-02T10:00:00-03:00' },
    { id: 11, nome: 'Mário Santos',   email: 'mario@empresa.com', perfil: 'FUNCIONARIO', ativo: true, criadoEm: '2025-01-03T11:00:00-03:00' },
  ]);

  list$(): Observable<Usuario[]> {
    return this._data$.asObservable();
  }

  getAll(): Usuario[] {
    return this._data$.getValue();
  }

  private onlyFuncionarios(arr = this.getAll()): Usuario[] {
    return arr.filter(u => u.perfil === 'FUNCIONARIO');
  }

  private nextId(): number {
    return Math.max(...this.getAll().map(f => f.id), 0) + 1;
  }

  private emailExists(email: string, excludeId?: number): boolean {
    return this.getAll().some(
      f => (f.email ?? '').toLowerCase() === email.toLowerCase() && f.id !== excludeId
    );
  }

  inserir(usuario: Usuario): Observable<Usuario> {
    if (!usuario.email) {
      return throwError(() => new Error('E-mail é obrigatório.'));
    }
    if (this.emailExists(usuario.email)) {
      return throwError(() => new Error('E-mail já está em uso.'));
    }

    const novo: Usuario = {
      ...usuario,
      id: this.nextId(),
      perfil: 'FUNCIONARIO',
      ativo: true,
      criadoEm: new Date().toISOString(),
    };

    this._data$.next([...this.getAll(), novo]);
    return of(novo).pipe(delay(150));
  }

  atualizar(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    const arr = this.getAll();
    const idx = arr.findIndex(f => f.id === id);
    if (idx < 0) {
      return throwError(() => new Error('Funcionário não encontrado.'));
    }

    if (usuario.email && this.emailExists(usuario.email, id)) {
      return throwError(() => new Error('E-mail já está em uso.'));
    }

    const atual = { ...arr[idx], ...usuario } as Usuario;
    const novo = [...arr];
    novo[idx] = atual;

    this._data$.next(novo);
    return of(atual).pipe(delay(150));
  }

  remover(id: number, currentUserId: number): Observable<boolean> {
    const arr = this.getAll();
    const totalFuncionarios = this.onlyFuncionarios(arr).length;

    if (totalFuncionarios <= 1) {
      return throwError(() => new Error('Não é possível remover: existe apenas um funcionário no sistema.'));
    }
    if (id === currentUserId) {
      return throwError(() => new Error('Você não pode remover a si mesmo.'));
    }

    const idx = arr.findIndex(f => f.id === id);
    if (idx < 0) {
      return throwError(() => new Error('Funcionário não encontrado.'));
    }

    const novo = [...arr];
    novo.splice(idx, 1);
    this._data$.next(novo);

    return of(true).pipe(delay(120));
  }
}
