import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Orcamento } from '../models/orcamento.model';
import { Solicitacao } from '../models/solicitacao.model'; // se precisar

@Injectable({ providedIn: 'root' })
export class OrcamentosService {
  // Seeds de exemplo
  private readonly _data$ = new BehaviorSubject<Orcamento[]>([
    { id: 1,  solicitacaoId: 101, valorTotal: 150.00, moeda: 'BRL', criadoEm: '2025-09-01T09:10:00-03:00', observacao: 'Substituição peça A' },
    { id: 2,  solicitacaoId: 102, valorTotal: 220.50, moeda: 'BRL', criadoEm: '2025-09-01T15:25:00-03:00', observacao: 'Mão de obra' },
    { id: 3,  solicitacaoId: 103, valorTotal: 90.00,  moeda: 'BRL', criadoEm: '2025-09-05T10:05:00-03:00' },
    { id: 4,  solicitacaoId: 104, valorTotal: 500.00, moeda: 'BRL', criadoEm: '2025-09-05T16:40:00-03:00', observacao: 'Kit completo' },
    { id: 5,  solicitacaoId: 105, valorTotal: 75.75,  moeda: 'BRL', criadoEm: '2025-09-12T11:00:00-03:00' },
    { id: 6,  solicitacaoId: 106, valorTotal: 300.00, moeda: 'BRL', criadoEm: '2025-10-03T08:45:00-03:00' },
  ]);

  list$(): Observable<Orcamento[]> {
    return this._data$.asObservable();
  }
}