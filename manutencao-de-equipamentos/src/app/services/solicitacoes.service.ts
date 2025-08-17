// src/app/solicitacoes.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';
import {
  StatusSolicitacao,
  STATUS_SOLICITACOES,
} from '../models/status-solicitacao.model';

// Defina ID localmente (ou crie src/app/models/common.model.ts e importe de lá)
type ID = number;

export type ListItemRF003 = {
  solicitacaoId: ID;
  dataHoraSolicitacao: string;
  equipamentoDesc30: string;
  estadoSolicitacao: string; // label
  requiresAction: boolean;
  actionType: 'NONE' | 'APPROVE_REJECT_BUDGET';
};

@Injectable({ providedIn: 'root' })
export class SolicitacoesService {
  // Catálogo de status vem da model (status físicos)
  private statusCatalog: StatusSolicitacao[] = [...STATUS_SOLICITACOES];

  // MOCK de solicitações
  private solicitacoes: Solicitacao[] = [
    {
      id: 101,
      clienteId: 1,
      descricaoEquipamento: 'Impressora LaserJet Pro 400 MFP M425dn',
      descricaoProblema: 'Não puxa papel e aparece erro 13.20.00',
      criadoEm: '2025-08-15T08:12:00-03:00',
      statusAtualId: 2, // ORÇADA
      atualizadoEm: '2025-08-16T10:00:00-03:00',
    },
    {
      id: 102,
      clienteId: 1,
      descricaoEquipamento: 'Notebook Lenovo ThinkPad T14 Gen 2',
      descricaoProblema: 'Superaquecimento após 20 min de uso',
      criadoEm: '2025-08-16T09:00:00-03:00',
      statusAtualId: 3, // APROVADA
      atualizadoEm: '2025-08-16T12:30:00-03:00',
    },
    {
      id: 103,
      clienteId: 1,
      descricaoEquipamento: 'Monitor LG Ultrawide 34WN80C-B',
      descricaoProblema: 'Sem sinal na porta DisplayPort',
      criadoEm: '2025-08-14T14:45:00-03:00',
      statusAtualId: 1, // CRIADA
      atualizadoEm: '2025-08-14T14:45:00-03:00',
    },
  ];

  private findStatus(id: number): StatusSolicitacao {
    const st = this.statusCatalog.find((s) => s.id === id);
    if (!st) throw new Error('Status não encontrado');
    return st;
  }

  listByCliente(clienteId: ID): Observable<ListItemRF003[]> {
    return of(this.solicitacoes).pipe(
      map((list) =>
        list
          .filter((s) => s.clienteId === clienteId)
          .sort(
            (a, b) =>
              new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
          ) // crescente
          .map((s) => {
            const st = this.findStatus(s.statusAtualId);
            const desc = s.descricaoEquipamento ?? '';
            return {
              solicitacaoId: s.id,
              dataHoraSolicitacao: s.criadoEm,
              equipamentoDesc30: desc.length > 30 ? desc.slice(0, 30) : desc,
              estadoSolicitacao: st.nome,
              requiresAction: st.requiresAction,
              actionType: st.actionType,
            } as ListItemRF003;
          })
      )
    );
  }
}
