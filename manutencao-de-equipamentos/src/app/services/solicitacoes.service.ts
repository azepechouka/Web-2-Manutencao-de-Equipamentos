import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';
import { Orcamento } from '../models/orcamento.model';

/**
 * Serviço responsável por comunicação HTTP com a API de solicitações e orçamentos.
 */
@Injectable({ providedIn: 'root' })
export class SolicitacoesService {
  private readonly http = inject(HttpClient);

  // ✅ Endpoints base
  private readonly API = 'http://localhost:8080/api';
  private readonly SOLICITACOES = `${this.API}/solicitacao`;
  private readonly ORCAMENTOS = `${this.API}/orcamento`;

  // ===========================================================================
  // 🔹 Solicitações
  // ===========================================================================

  /**
   * Lista todas as solicitações (modo administrativo).
   */
  listTodas(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.SOLICITACOES);
  }

  /**
   * Lista todas as solicitações de um cliente específico.
   * @param clienteId ID do cliente
   */
  listByCliente(clienteId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.SOLICITACOES}/cliente/${clienteId}`);
  }

  /**
   * Obtém uma solicitação pelo seu ID.
   * @param id ID da solicitação
   */
  getById(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.SOLICITACOES}/${id}`);
  }

  /**
   * Cria uma nova solicitação.
   * @param data Dados parciais da solicitação
   */
  criarSolicitacao(data: Partial<Solicitacao>): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.SOLICITACOES, data);
  }

  /**
   * Lista todas as solicitações em aberto (para uso interno / funcionário).
   */
  listEmAberto(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.SOLICITACOES}/em-aberto`);
  }

  // ===========================================================================
  // 🔹 Ações sobre orçamento
  // ===========================================================================

  /**
   * Aprova o orçamento de uma solicitação.
   * @param solicitacaoId ID da solicitação
   */
  aprovarOrcamento(solicitacaoId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.SOLICITACOES}/${solicitacaoId}/aprovar`, {});
  }

  /**
   * Rejeita o orçamento de uma solicitação com um motivo.
   * @param solicitacaoId ID da solicitação
   * @param motivo Texto explicando o motivo da rejeição
   */
  rejeitarOrcamento(solicitacaoId: number, motivo: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.SOLICITACOES}/${solicitacaoId}/rejeitar`, { motivo });
  }

  /**
   * Obtém o orçamento vinculado a uma solicitação específica.
   * @param solicitacaoId ID da solicitação
   */
  getOrcamentoBySolicitacao(solicitacaoId: number): Observable<Orcamento> {
    return this.http.get<Orcamento>(`${this.ORCAMENTOS}/solicitacao/${solicitacaoId}`);
  }

  /**
   * Efetua (registra) um orçamento para uma solicitação.
   * @param params Parâmetros contendo valor, funcionário e observações
   */
  efetuarOrcamento(params: {
    solicitacaoId: number;
    valorTotal: number;
    funcionarioId: number;
    observacao?: string;
    moeda?: string;
  }): Observable<Orcamento> {
    return this.http.post<Orcamento>(this.ORCAMENTOS, params);
  }

  // ===========================================================================
  // 🔹 Relatórios
  // ===========================================================================

  /**
   * (Opcional) Relatório de receita por categoria — usado na página de relatórios.
   * Caso o backend ainda não esteja pronto, retorna mock local.
   */
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
    // Se o endpoint existir no backend:
    // return this.http.get<ReceitaCategoriaItem[]>(`${this.API}/relatorios/receita-por-categoria`);

    // Mock temporário (para uso local)
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
