import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CategoriaRequestDTO, CategoriaResponseDTO } from '../dtos/categoria-dto';

// Ajuste se usar environments:
const API_BASE = (window as any).__API_BASE__ || '';
const API = `${API_BASE}/api/categorias`;

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private _items$ = new BehaviorSubject<CategoriaResponseDTO[]>([]);
  readonly items$ = this._items$.asObservable();

  refresh(): Observable<CategoriaResponseDTO[]> {
    return this.http.get<CategoriaResponseDTO[]>(API).pipe(
      tap(items => this._items$.next(items))
    );
  }

  create(req: CategoriaRequestDTO): Observable<CategoriaResponseDTO> {
    return this.http.post<CategoriaResponseDTO>(API, req).pipe(
      tap(created => this._items$.next([created, ...this._items$.value]))
    );
  }

  update(id: number, req: CategoriaRequestDTO): Observable<CategoriaResponseDTO> {
    return this.http.put<CategoriaResponseDTO>(`${API}/${id}`, req).pipe(
      tap(updated => {
        const arr = this._items$.value.map(i => (i.id === id ? updated : i));
        this._items$.next(arr);
      })
    );
  }

  remove(id: number): Observable<void> {
    // Troque para DELETE quando o endpoint existir no backend:
    return new Observable<void>(subscriber => {
      this._items$.next(this._items$.value.filter(i => i.id !== id));
      subscriber.next(); subscriber.complete();
    });
  }
}
