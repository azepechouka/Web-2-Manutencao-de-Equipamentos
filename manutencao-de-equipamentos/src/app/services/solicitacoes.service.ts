import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';
import { Orcamento } from '../models/orcamento.model';

@Injectable({ providedIn: 'root' })
export class SolicitacoesService {
  private readonly http = inject(HttpClient);

  // ✅ Endpoints base
  private readonly API = 'http://localhost:8080/api';
  private readonly SOLICITACOES = `${this.API}/solicitacao`;
  private readonly ORCAMENTOS = `${this.API}/orcamento`;

  listTodas(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.SOLICITACOES);
  }

  listByCliente(clienteId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.SOLICITACOES}/cliente/${clienteId}`);
  }

  getById(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.SOLICITACOES}/${id}`);
  }

  criarSolicitacao(data: Partial<Solicitacao>): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.SOLICITACOES, data);
  }

  listEmAberto(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.SOLICITACOES}/em-aberto`);
  }


  aprovarOrcamento(solicitacaoId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.SOLICITACOES}/${solicitacaoId}/aprovar`, {});
  }

  rejeitarOrcamento(solicitacaoId: number, motivo: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.SOLICITACOES}/${solicitacaoId}/rejeitar`, { motivo });
  }

  getOrcamentoBySolicitacao(solicitacaoId: number): Observable<Orcamento> {
    return this.http.get<Orcamento>(`${this.ORCAMENTOS}/solicitacao/${solicitacaoId}`);
  }


  efetuarOrcamento(params: {
    solicitacaoId: number;
    valorTotal: number;
    funcionarioId: number;
    observacao?: string;
    moeda?: string;
  }): Observable<Orcamento> {
    return this.http.post<Orcamento>(this.ORCAMENTOS, params);
  }

  relatorioReceitaPorCategoria$(): Observable<
    {
      categoriaId: number | null;
      categoriaDescricao: string;
      total: number;
      quantidade: number;
      primeira: string | null;
      ultima: string | null;
    }[]
  > {

    return new Observable((observer) => {
      observer.next([
        {
          categoriaId: 1,
          categoriaDescricao: 'Impressão Digital',
          total: 3200,
          quantidade: 5,
          primeira: '2025-10-10',
          ultima: '2025-11-02',
        },
        {
          categoriaId: 2,
          categoriaDescricao: 'Plotagem',
          total: 1800,
          quantidade: 3,
          primeira: '2025-10-12',
          ultima: '2025-10-28',
        },
      ]);
      observer.complete();
    });
  }
}
