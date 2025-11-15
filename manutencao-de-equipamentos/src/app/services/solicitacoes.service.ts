import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ManutencaoRequest, Solicitacao, SolicitacaoCreateDto,SolicitacaoResponse } from '../models/solicitacao.model';
import { Orcamento } from '../models/orcamento.model';
import { AuthService } from './auth.service';
import { HistoricoStatus, HistoricoStatusDTO  } from '../models/historico-status.model';
import {ReceitaDia} from '../dtos/Receita-dia.dto';
import { ReceitaCategoria } from '../dtos/receita-categoria.dto';

@Injectable({ providedIn: 'root' })
export class SolicitacoesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService); 

  private readonly API = 'http://localhost:8080/api';
  private readonly SOLICITACOES = `${this.API}/solicitacao`;
  private readonly ORCAMENTOS = `${this.API}/orcamento`;
  private readonly CLIENTES = `${this.API}/usuario`;

  listTodas(): Observable<SolicitacaoResponse[]> {
    const usuarioId = this.auth.getUsuarioId(); 

    if (!usuarioId) {
      throw new Error('Nenhum usuário autenticado');
    }

    return this.http.get<SolicitacaoResponse[]>(`${this.SOLICITACOES}?usuarioId=${usuarioId}`);
  }


  getById(id: number): Observable<SolicitacaoResponse> {
    return this.http.get<SolicitacaoResponse>(`${this.SOLICITACOES}/${id}`);
  }

  listByCliente(clienteId: number): Observable<SolicitacaoResponse[]> {
    return this.http.get<SolicitacaoResponse[]>(`${this.SOLICITACOES}/cliente/${clienteId}`);
  }

  listEmAberto(): Observable<SolicitacaoResponse[]> {
    return this.http.get<SolicitacaoResponse[]>(`${this.SOLICITACOES}/em-aberto`);
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

  getOrcamentoBySolicitacao(solicitacaoId: number): Observable<Orcamento> {
    return this.http.get<Orcamento>(`${this.ORCAMENTOS}/solicitacao/${solicitacaoId}`);
  }

  efetuarOrcamento(params: {
    solicitacaoId: number;
    valor: number;
    funcionarioId: number;
    observacao?: string;
    moeda?: string;
  }): Observable<Orcamento> {
    return this.http.post<Orcamento>(this.ORCAMENTOS, params);
  }
  
  aprovarOrcamento(solicitacaoId: number, usuarioId: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.SOLICITACOES}/${solicitacaoId}/aprovar`,
      { usuarioId }
    );
  }

  rejeitarOrcamento(solicitacaoId: number, usuarioId: number, motivo: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.SOLICITACOES}/${solicitacaoId}/rejeitar`, { motivo, usuarioId });
  }

  getDetalhesCompletos(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.SOLICITACOES}/${id}/detalhes`);
  }

  getHistoricoBySolicitacao(id: number): Observable<HistoricoStatusDTO[]> {
    return this.http.get<HistoricoStatusDTO[]>(`${this.API}/historico/solicitacao/${id}`);
  }

  resgatarSolicitacao(solicitacaoId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.SOLICITACOES}/${solicitacaoId}/resgatar`, {});
  }


  efetuarManutencao(req: ManutencaoRequest) {
    return this.http.post(`${this.SOLICITACOES}/${req.solicitacaoId}/efetuar-manutencao`, req);
  }

  redirecionarManutencao(solicitacaoId: number, motivo: string, destinoFuncionarioId: number): Observable<boolean> {
    const usuarioId = this.auth.getUsuarioId();  // Obtém o ID do usuário logado

    if (!usuarioId) {
      throw new Error('Usuário não autenticado');
    }

    const payload = {
      motivo,
      destinoFuncionarioId,
      funcionarioRequisitanteId: usuarioId 
    };

    return this.http.post<boolean>(
      `${this.SOLICITACOES}/${solicitacaoId}/redirecionar`,
      payload
    );
  }

  pagar(solicitacaoId: number, usuarioId: number) {
    return this.http.post<boolean>(
      `${this.SOLICITACOES}/${solicitacaoId}/pagar`,
      { usuarioId }
    );
  }

  finalizarSolicitacao(id: number, usuarioId: number) {
    return this.http.post(
      `${this.SOLICITACOES}/${id}/finalizar`,
      { usuarioId }
    );
  }

  relatorioReceita(dataIni: string | null, dataFim: string | null): Observable<ReceitaDia[]> {
    const params: any = {};

    if (dataIni) params.dataIni = dataIni;
    if (dataFim) params.dataFim = dataFim;

    return this.http.get<ReceitaDia[]>(`${this.SOLICITACOES}/relatorio/receita`, { params });
  }
  relatorioReceitaPorCategoria(): Observable<ReceitaCategoria[]> {
    return this.http.get<ReceitaCategoria[]>(`${this.SOLICITACOES}/relatorio/receita-categoria`);
  }
}
