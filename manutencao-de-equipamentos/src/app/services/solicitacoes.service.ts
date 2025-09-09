// src/app/services/solicitacoes.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';
import { Orcamento } from '../models/orcamento.models';
import {
  StatusSolicitacao,
  STATUS_SOLICITACOES,
} from '../models/status-solicitacao.model';
import { HistoricoStatus } from '../models/historico-status.model';
import { Usuario } from '../models/usuario.model';

type ID = number;

export type ListItemRF003 = {
  solicitacaoId: ID;
  dataHoraSolicitacao: string;
  equipamentoDesc30: string;
  estadoSolicitacao: string; // label
  requiresAction: boolean;
  actionType: string;
};

// Novo tipo para os detalhes da solicitação (RF008)
export type DetalheSolicitacao = Solicitacao & {
  statusAtualNome: string;
  historico: (HistoricoStatus & { statusNome: string, usuarioNome?: string })[];
};

@Injectable({ providedIn: 'root' })
export class SolicitacoesService {
  private statusCatalog: StatusSolicitacao[] = [...STATUS_SOLICITACOES];

  private usuarios: Usuario[] = [
    { id: 1, nome: 'João Cliente', perfil: 'CLIENTE', ativo: true, criadoEm: '' },
    { id: 10, nome: 'Maria Funcionária', perfil: 'FUNCIONARIO', ativo: true, criadoEm: '' },
    { id: 11, nome: 'Mário Funcionário', perfil: 'FUNCIONARIO', ativo: true, criadoEm: '' }
  ];

  private solicitacoes: Solicitacao[] = [
    {
      id: 101,
      clienteId: 1,
      descricaoEquipamento: 'Impressora LaserJet Pro 400 MFP M425dn',
      descricaoProblema: 'Não puxa papel e aparece erro 13.20.00 na tela principal. Já tentei reiniciar e o problema persiste.',
      criadoEm: '2025-08-15T08:12:00-03:00',
      statusAtualId: 2,
      atualizadoEm: '2025-08-16T10:00:00-03:00',
    },
    // ... (outras solicitações que você já tinha)
  ];

  private historicos: HistoricoStatus[] = [
    { id: 1, solicitacaoId: 101, deStatusId: null, paraStatusId: 1, criadoEm: '2025-08-15T08:12:00-03:00', usuarioId: 1 },
    { id: 2, solicitacaoId: 101, deStatusId: 1, paraStatusId: 2, criadoEm: '2025-08-16T10:00:00-03:00', usuarioId: 10, observacao: 'Orçamento: R$ 250,00' },
  ];

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
          .sort(
            (a, b) =>
              new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
          )
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

  // Novo método para buscar detalhes (RF008)
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
        return {
          ...h,
          statusNome: status.nome,
          usuarioNome: usuario?.nome || 'Sistema'
        };
      })
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()); // Mais recente primeiro

    const statusAtual = this.findStatus(solicitacao.statusAtualId);

    const detalhe: DetalheSolicitacao = {
      ...solicitacao,
      statusAtualNome: statusAtual.nome,
      historico: historico
    };

    return of(detalhe);
  }
}