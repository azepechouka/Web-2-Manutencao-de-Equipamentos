// src/app/services/solicitacoes.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';
import { Orcamento } from '../models/orcamento.model';
import { StatusSolicitacao, STATUS_SOLICITACOES } from '../models/status-solicitacao.model';
import { HistoricoStatus } from '../models/historico-status.model';
import { Usuario } from '../models/usuario.model';

type ID = number;

export type ListItemRF003 = {
  solicitacaoId: ID;
  dataHoraSolicitacao: string;
  equipamentoDesc30: string;
  estadoSolicitacao: string;
  requiresAction: boolean;
  actionType: string;
};

export interface ReceitaCategoriaItem {
  categoriaId: number | null;
  categoriaDescricao: string;
  total: number;
  quantidade: number;
  primeira: string | null;
  ultima: string | null;
}

export type DetalheSolicitacao = Solicitacao & {
  statusAtualNome: string;
  historico: (HistoricoStatus & { statusNome: string; usuarioNome?: string })[];
};

@Injectable({ providedIn: 'root' })
export class SolicitacoesService {
  private statusCatalog: StatusSolicitacao[] = [...STATUS_SOLICITACOES];
  private historicos: HistoricoStatus[] = [];
  private orcamentos: Orcamento[] = [];
  private solicitacoes: Solicitacao[] = [];
  private usuarios: Usuario[] = [];

  private findStatus(id: number): StatusSolicitacao {
    const st = this.statusCatalog.find((s) => s.id === id);
    if (!st) throw new Error('Status não encontrado');
    return st;
  }

  private findUsuario(id: number): Usuario | undefined {
    return this.usuarios.find(u => u.id === id);
  }

  listByCliente(clienteId: ID): Observable<ListItemRF003[]> {
    return of(this.solicitacoes).pipe(
      map((list) =>
        list
          .filter((s) => s.clienteId === clienteId)
          .sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime())
          .map((s) => {
            const st = this.findStatus(s.statusAtualId);
            const desc = s.descricaoEquipamento ?? '';
            return {
              solicitacaoId: s.id,
              dataHoraSolicitacao: s.criadoEm,
              equipamentoDesc30: desc.length > 30 ? desc.slice(0, 30) + '...' : desc,
              estadoSolicitacao: st.nome,
              requiresAction: st.requiresAction,
              actionType: st.actionType,
            } as ListItemRF003;
          })
      )
    );
  }

  getById(solicitacaoId: ID): Observable<DetalheSolicitacao | undefined> {
    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (!solicitacao) {
      return of(undefined);
    }

    const historico = this.historicos
      .filter(h => h.solicitacaoId === solicitacaoId)
      .map(h => {
        const status = this.findStatus(h.paraStatusId);
        const usuario = h.usuarioId ? this.findUsuario(h.usuarioId) : undefined;
        return { ...h, statusNome: status.nome, usuarioNome: usuario?.nome || 'Sistema' };
      })
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

    const statusAtual = this.findStatus(solicitacao.statusAtualId);

    const detalhe: DetalheSolicitacao = {
      ...solicitacao,
      statusAtualNome: statusAtual.nome,
      historico: historico
    };

    return of(detalhe);
  }

  aprovarOrcamento(solicitacaoId: ID): Observable<boolean> {
    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (solicitacao) {
      solicitacao.statusAtualId = 3;
      solicitacao.atualizadoEm = new Date().toISOString();
      this.historicos.push({
        id: Date.now(),
        solicitacaoId,
        deStatusId: 2,
        paraStatusId: 3,
        criadoEm: new Date().toISOString(),
        usuarioId: 1,
        observacao: 'Orçamento aprovado pelo cliente'
      });
      return of(true);
    }
    return of(false);
  }

  rejeitarOrcamento(solicitacaoId: ID, motivoRejeicao: string): Observable<boolean> {
    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (solicitacao) {
      solicitacao.statusAtualId = 4;
      solicitacao.atualizadoEm = new Date().toISOString();
      this.historicos.push({
        id: Date.now(),
        solicitacaoId,
        deStatusId: 2,
        paraStatusId: 4,
        criadoEm: new Date().toISOString(),
        usuarioId: 1,
        observacao: `Orçamento rejeitado pelo cliente. Motivo: ${motivoRejeicao}`
      });
      return of(true);
    }
    return of(false);
  }

  getOrcamentoBySolicitacao(solicitacaoId: ID): Observable<Orcamento | undefined> {
    const orcamento = this.orcamentos.find(o => o.solicitacaoId === solicitacaoId);
    return of(orcamento);
  }

  listParaFuncionarioEmAberto(): Observable<{
    solicitacaoId: number;
    dataHoraSolicitacao: string;
    clienteNome: string;
    equipamentoDesc30: string;
  }[]> {
    const codigosAbertos = new Set(['ABERTA']);
    const idsAbertos = this.statusCatalog
      .filter(s => codigosAbertos.has(s.codigo?.toUpperCase?.()))
      .map(s => s.id);
    const idsSet = new Set<number>(idsAbertos.length ? idsAbertos : [1]);

    return of(this.solicitacoes).pipe(
      map(list =>
        list
          .filter(s => idsSet.has(s.statusAtualId))
          .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
          .map(s => ({
            solicitacaoId: s.id,
            dataHoraSolicitacao: s.criadoEm,
            clienteNome: this.findUsuario(s.clienteId)?.nome ?? `Cliente #${s.clienteId}`,
            equipamentoDesc30: (s.descricaoEquipamento ?? '').length > 30
              ? (s.descricaoEquipamento ?? '').slice(0, 30) + '...'
              : (s.descricaoEquipamento ?? ''),
          }))
      )
    );
  }

  getClienteById$(id: number) {
    return of(this.findUsuario(id));
  }

  efetuarOrcamento(params: { solicitacaoId: number; valorTotal: number; funcionarioId: number; observacao?: string; moeda?: string; }) {
    const { solicitacaoId, valorTotal, funcionarioId, observacao, moeda = 'BRL' } = params;
    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (!solicitacao) throw new Error('Solicitação não encontrada');

    const deStatusId = solicitacao.statusAtualId;
    const stOrcada = this.statusCatalog.find(s => s.codigo?.toUpperCase() === 'ORCADA');
    const paraStatusId = stOrcada?.id ?? 2;

    const novoId = Math.max(0, ...this.orcamentos.map(o => o.id)) + 1;
    const agoraIso = new Date().toISOString();
    const novoOrc: Orcamento = {
      id: novoId,
      solicitacaoId,
      valorTotal,
      moeda,
      observacao,
      criadoEm: agoraIso,
    };
    this.orcamentos.push(novoOrc);

    solicitacao.statusAtualId = paraStatusId;
    solicitacao.atualizadoEm = agoraIso;

    this.historicos.push({
      id: Date.now(),
      solicitacaoId,
      deStatusId,
      paraStatusId,
      criadoEm: agoraIso,
      usuarioId: funcionarioId,
      observacao: `Orçamento registrado no valor de ${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: moeda })}${observacao ? ` — ${observacao}` : ''}`,
    });

    return of(novoOrc);
  }

  listTodasResumo$(): Observable<{
    id: number;
    criadoEm: string;
    clienteNome: string;
    equipamentoDesc: string;
    statusCodigo: string;
    statusNome: string;
  }[]> {
    return of(this.solicitacoes).pipe(
      map(list =>
        list.map(s => {
          const st = this.findStatus(s.statusAtualId);
          const cli = this.findUsuario(s.clienteId);
          return {
            id: s.id,
            criadoEm: s.criadoEm,
            clienteNome: cli?.nome ?? `Cliente #${s.clienteId}`,
            equipamentoDesc: s.descricaoEquipamento ?? '',
            statusCodigo: st.codigo?.toUpperCase?.() ?? 'DESCONHECIDO',
            statusNome: st.nome ?? 'Desconhecido',
          };
        })
      )
    );
  }

  setCategoriaDaSolicitacao(solicitacaoId: number, categoriaId: number | null): void {
    const s = this.solicitacoes.find(x => x.id === solicitacaoId);
    if (!s) throw new Error('Solicitação não encontrada.');
    (s as any).categoriaEquipamentoId = categoriaId ?? undefined;
    s.atualizadoEm = new Date().toISOString();
  }

  relatorioReceitaPorCategoria$(lookup?: Record<number, string>): Observable<ReceitaCategoriaItem[]> {
    return of(this.orcamentos).pipe(
      map(orcamentos => {
        const solById = new Map(this.solicitacoes.map(s => [s.id, s]));
        const groups = new Map<number | null, { total: number; qtd: number; first: string | null; last: string | null }>();

        for (const o of orcamentos) {
          const sol = solById.get(o.solicitacaoId);
          const catId: number | null = (sol as any)?.categoriaEquipamentoId ?? null;

          const g = groups.get(catId) ?? { total: 0, qtd: 0, first: null, last: null };
          g.total += o.valorTotal ?? 0;
          g.qtd += 1;

          if (o.criadoEm) {
            const iso = new Date(o.criadoEm).toISOString();
            if (!g.first || iso < g.first) g.first = iso;
            if (!g.last  || iso > g.last)  g.last  = iso;
          }
          groups.set(catId, g);
        }

        const items: ReceitaCategoriaItem[] = Array.from(groups.entries()).map(([catId, g]) => {
          const desc = catId == null ? 'Sem categoria' : (lookup?.[catId] ?? `Categoria #${catId}`);
          return { categoriaId: catId, categoriaDescricao: desc, total: g.total, quantidade: g.qtd, primeira: g.first, ultima: g.last };
        });

        items.sort((a, b) => b.total - a.total);
        return items;
      })
    );
  }
}
