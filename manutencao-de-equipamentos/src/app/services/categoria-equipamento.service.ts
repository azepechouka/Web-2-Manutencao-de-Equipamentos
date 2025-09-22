import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CategoriaEquipamento } from '../models/categoria-equipamento.model';

@Injectable({ providedIn: 'root' })
export class CategoriaEquipamentoService {
  private readonly STORAGE_KEY = 'cat.equipamento';
  private readonly _data$ = new BehaviorSubject<CategoriaEquipamento[]>(this.load());

  list$(): Observable<CategoriaEquipamento[]> {
    // ordena por descrição ascendente
    return this._data$.pipe(
      map(list => [...list].sort((a, b) => a.descricao.localeCompare(b.descricao, 'pt-BR')))
    );
  }

  getAll(): CategoriaEquipamento[] {
    return this._data$.getValue();
  }

  getById(id: number): CategoriaEquipamento | undefined {
    return this.getAll().find(c => c.id === id);
  }

  add(descricao: string): CategoriaEquipamento {
    const desc = (descricao ?? '').trim();
    if (!desc) throw new Error('Descrição obrigatória.');
    this.assertUnique(desc);

    const nextId = Math.max(0, ...this.getAll().map(c => c.id)) + 1;
    const novo: CategoriaEquipamento = { id: nextId, descricao: desc };
    const updated = [...this.getAll(), novo];
    this.commit(updated);
    return novo;
  }

  update(id: number, descricao: string): CategoriaEquipamento {
    const desc = (descricao ?? '').trim();
    if (!desc) throw new Error('Descrição obrigatória.');
    this.assertUnique(desc, id);

    const list = this.getAll();
    const idx = list.findIndex(c => c.id === id);
    if (idx < 0) throw new Error('Categoria não encontrada.');

    const updated = [...list];
    updated[idx] = { ...updated[idx], descricao: desc };
    this.commit(updated);
    return updated[idx];
  }

  remove(id: number): void {
    const updated = this.getAll().filter(c => c.id !== id);
    this.commit(updated);
  }

  // ——— Helpers ———
  private commit(data: CategoriaEquipamento[]) {
    this.save(data);
    this._data$.next(data);
  }

  private assertUnique(descricao: string, exceptId?: number) {
    const exists = this.getAll().some(
      c => c.descricao.toLocaleLowerCase() === descricao.toLocaleLowerCase() && c.id !== exceptId
    );
    if (exists) throw new Error('Já existe uma categoria com esta descrição.');
  }

  private load(): CategoriaEquipamento[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CategoriaEquipamento[];
    } catch {}
    // seed inicial
    const seed: CategoriaEquipamento[] = [
      { id: 1, descricao: 'Impressora' },
      { id: 2, descricao: 'Notebook' },
      { id: 3, descricao: 'Desktop' },
      { id: 4, descricao: 'Roteador' },
      { id: 5, descricao: 'Scanner' },
    ];
    this.save(seed);
    return seed;
  }

  private save(data: CategoriaEquipamento[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
}
