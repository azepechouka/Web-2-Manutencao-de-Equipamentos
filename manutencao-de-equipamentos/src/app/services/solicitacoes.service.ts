import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Solicitacao, SolicitacaoCreateDto } from '../models/solicitacao.model';
import { Orcamento } from '../models/orcamento.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SolicitacoesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService); 

  private readonly API = 'http://localhost:8080/api';
  private readonly SOLICITACOES = `${this.API}/solicitacao`;
  private readonly ORCAMENTOS = `${this.API}/orcamento`;
  private readonly CLIENTES = `${this.API}/usuario`;

  listTodas(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.SOLICITACOES);
  }

  getById(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.SOLICITACOES}/${id}`);
  }

  listByCliente(clienteId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.SOLICITACOES}/cliente/${clienteId}`);
  }

  listEmAberto(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.SOLICITACOES}/em-aberto`);
  }

  criarSolicitacao(data: Partial<Solicitacao>): Observable<Solicitacao> {
    const clienteId = this.auth.getUsuarioId();
    console.log(clienteId);
    if (!clienteId) {
      throw new Error('Nenhum cliente autenticado.');
    }

    const payload = { ...data, clienteId }; 
    return this.http.post<Solicitacao>(this.SOLICITACOES, payload);
  }

  adicionarSolicitacao(payload: SolicitacaoCreateDto): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.SOLICITACOES, payload);
  }

  getClienteById$(clienteId: number): Observable<any> {
    if (!clienteId) return of(null);
    return this.http.get<any>(`${this.CLIENTES}/${clienteId}`);
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
  aprovarOrcamento(solicitacaoId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.SOLICITACOES}/${solicitacaoId}/aprovar`, {});
  }

  rejeitarOrcamento(solicitacaoId: number, motivo: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.SOLICITACOES}/${solicitacaoId}/rejeitar`, { motivo });}


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
