import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Orcamento } from '../models/orcamento.model';

@Injectable({ providedIn: 'root' })
export class OrcamentosService {
  private readonly _data$ = new BehaviorSubject<Orcamento[]>([
    { id: 1,  solicitacaoId: 201, valorTotal: 180.00,  moeda: 'BRL', criadoEm: '2025-01-01T08:15:00-03:00', observacao: 'Atendimento de ano novo' },
    { id: 2,  solicitacaoId: 202, valorTotal: 350.50,  moeda: 'BRL', criadoEm: '2025-01-01T14:40:00-03:00', observacao: 'Troca de placa' },
    { id: 3,  solicitacaoId: 203, valorTotal: 90.00,   moeda: 'BRL', criadoEm: '2025-01-02T10:05:00-03:00' },
    { id: 4,  solicitacaoId: 204, valorTotal: 500.00,  moeda: 'BRL', criadoEm: '2025-01-02T16:40:00-03:00', observacao: 'Kit completo' },
    { id: 5,  solicitacaoId: 205, valorTotal: 75.75,   moeda: 'BRL', criadoEm: '2025-01-05T11:00:00-03:00' },

    { id: 6,  solicitacaoId: 206, valorTotal: 120.00,  moeda: 'BRL', criadoEm: '2025-02-10T09:20:00-03:00', observacao: 'Limpeza geral' },
    { id: 7,  solicitacaoId: 207, valorTotal: 780.99,  moeda: 'BRL', criadoEm: '2025-02-10T13:55:00-03:00', observacao: 'Conjunto de peças' },
    { id: 8,  solicitacaoId: 208, valorTotal: 64.90,   moeda: 'BRL', criadoEm: '2025-02-28T23:59:00-03:00', observacao: 'Ajuste fino' },

    { id: 9,  solicitacaoId: 209, valorTotal: 130.00,  moeda: 'BRL', criadoEm: '2025-03-01T00:01:00-03:00', observacao: 'Atendimento noturno' },
    { id: 10, solicitacaoId: 210, valorTotal: 300.00,  moeda: 'BRL', criadoEm: '2025-03-15T08:45:00-03:00' },
    { id: 11, solicitacaoId: 211, valorTotal: 300.00,  moeda: 'BRL', criadoEm: '2025-03-15T10:30:00-03:00' },
    { id: 12, solicitacaoId: 212, valorTotal: 1450.00, moeda: 'BRL', criadoEm: '2025-03-31T17:25:00-03:00', observacao: 'Projeto grande' },

    { id: 13, solicitacaoId: 101, valorTotal: 150.00,  moeda: 'BRL', criadoEm: '2025-09-01T09:10:00-03:00', observacao: 'Substituição peça A' },
    { id: 14, solicitacaoId: 102, valorTotal: 220.50,  moeda: 'BRL', criadoEm: '2025-09-01T15:25:00-03:00', observacao: 'Mão de obra' },
    { id: 15, solicitacaoId: 103, valorTotal: 90.00,   moeda: 'BRL', criadoEm: '2025-09-05T10:05:00-03:00' },
    { id: 16, solicitacaoId: 104, valorTotal: 500.00,  moeda: 'BRL', criadoEm: '2025-09-05T16:40:00-03:00', observacao: 'Kit completo' },
    { id: 17, solicitacaoId: 105, valorTotal: 75.75,   moeda: 'BRL', criadoEm: '2025-09-12T11:00:00-03:00' },

    { id: 18, solicitacaoId: 106, valorTotal: 300.00,  moeda: 'BRL', criadoEm: '2025-10-03T08:45:00-03:00' },
    { id: 19, solicitacaoId: 107, valorTotal: 999.99,  moeda: 'BRL', criadoEm: '2025-10-31T18:59:00-03:00', observacao: 'Fechamento do mês' },
  ]);

  list$(): Observable<Orcamento[]> {
    return this._data$.asObservable();
  }

  listarPorPeriodo$(dataInicio?: Date, dataFim?: Date): Observable<Orcamento[]> {
    return this._data$.pipe(
      map(orcamentos => {
        if (!dataInicio || !dataFim) {
          return orcamentos;
        }
        
        // Ajusta para considerar todo o dia final
        const fimAjustado = new Date(dataFim);
        fimAjustado.setHours(23, 59, 59, 999);
        
        return orcamentos.filter(o => {
          const dataOrcamento = new Date(o.criadoEm);
          return dataOrcamento >= dataInicio && dataOrcamento <= fimAjustado;
        });
      })
    );
  }

  getAll(): Orcamento[] {
    return this._data$.getValue();
  }

  replaceData(data: Orcamento[]) {
    this._data$.next([...data]);
  }

  add(o: Omit<Orcamento, 'id'>): Orcamento {
    const id = Math.max(0, ...this.getAll().map(x => x.id)) + 1;
    const novo: Orcamento = { id, ...o };
    this._data$.next([...this.getAll(), novo]);
    return novo;
  }
}