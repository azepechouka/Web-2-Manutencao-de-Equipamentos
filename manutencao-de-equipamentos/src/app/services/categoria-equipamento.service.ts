import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoriaEquipamento } from '../models/categoria-equipamento.model';

export type CategoriaDTO = { nome: string };

@Injectable({ providedIn: 'root' })
export class CategoriaEquipamentoService {
  private readonly api = 'http://localhost:8080';
  private readonly base = `${this.api}/api/categorias`;

  private readonly STORAGE_KEY = 'cat.equipamento';
  private readonly _data$ = new BehaviorSubject<CategoriaEquipamento[]>(this.load());

  constructor(private http: HttpClient) {}

  categoriaVazia(): CategoriaEquipamento {
    return { id: 0, nome: '' };
  }

  listaComVazio(): CategoriaEquipamento[] {
    return [this.categoriaVazia()];
  }

  list$(): Observable<CategoriaEquipamento[]> {
    return of(this.listaComVazio());
  }

  getById(_id: number): CategoriaEquipamento {
    return this.categoriaVazia();
  }

  add(_nome: string): CategoriaEquipamento {
    return this.categoriaVazia();
  }

  remove(_id: number): void {}

  getAll(): Observable<CategoriaEquipamento[]> {
    return this.http.get<CategoriaEquipamento[]>(this.base).pipe(
      map(list => [...list].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  create(dto: CategoriaDTO): Observable<CategoriaEquipamento> {
    return this.http.post<CategoriaEquipamento>(this.base, dto);
  }

  update(id: number, dto: CategoriaDTO): Observable<CategoriaEquipamento> {
    return this.http.put<CategoriaEquipamento>(`${this.base}/${id}`, dto);
  }

  private load(): CategoriaEquipamento[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CategoriaEquipamento[];
    } catch {}
    const seed: CategoriaEquipamento[] = [
      { id: 1, nome: 'Impressora' },
      { id: 2, nome: 'Notebook' },
      { id: 3, nome: 'Desktop' },
      { id: 4, nome: 'Roteador' },
      { id: 5, nome: 'Scanner' },
    ];
    this.save(seed);
    return seed;
  }

  private save(data: CategoriaEquipamento[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
}
