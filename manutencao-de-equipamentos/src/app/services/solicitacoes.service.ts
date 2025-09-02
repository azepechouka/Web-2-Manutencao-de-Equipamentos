import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';
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

// Novo tipo para a lista da home do funcionário (RF011)
export type ListItemRF011 = {
  solicitacaoId: ID;
  dataHoraAbertura: string;
  nomeCliente: string;
  equipamentoDesc30: string;
};

@Injectable({ providedIn: 'root' })
export class SolicitacoesService {
  private statusCatalog: StatusSolicitacao[] = [...STATUS_SOLICITACOES];

  private usuarios: Usuario[] = [
    { id: 1, nome: 'João Cliente', perfil: 'CLIENTE', ativo: true, criadoEm: '' },
    { id: 2, nome: 'Joana Cliente', perfil: 'CLIENTE', ativo: true, criadoEm: '' },
    { id: 10, nome: 'Maria Funcionária', perfil: 'FUNCIONARIO', ativo: true, criadoEm: '' },
    { id: 11, nome: 'Mário Funcionário', perfil: 'FUNCIONARIO', ativo: true, criadoEm: '' }
  ];

  private solicitacoes: Solicitacao[] = [
    {
      id: 101,
      clienteId: 1,
      descricaoEquipamento: 'Impressora LaserJet Pro 400 MFP M425dn',
      descricaoProblema: 'Não puxa papel e aparece erro 13.20.00 na tela principal.',
      criadoEm: '2025-08-15T08:12:00-03:00',
      statusAtualId: 4, // APROVADA
      atualizadoEm: '2025-08-17T11:00:00-03:00',
    },
    {
      id: 102,
      clienteId: 1,
      descricaoEquipamento: 'Notebook Dell Vostro',
      descricaoProblema: 'Tela azul ao iniciar o Windows.',
      criadoEm: '2025-08-18T14:30:00-03:00',
      statusAtualId: 2, // ORÇADA
      atualizadoEm: '2025-08-18T16:00:00-03:00',
    },
    {
      id: 103,
      clienteId: 2,
      descricaoEquipamento: 'Monitor Gamer Samsung Odyssey G5',
      descricaoProblema: 'O monitor não liga, o LED de status fica piscando e não dá imagem.',
      criadoEm: '2025-08-19T09:00:00-03:00',
      statusAtualId: 1, // ABERTA
      atualizadoEm: '2025-08-19T09:00:00-03:00',
    }
  ];

  private historicos: HistoricoStatus[] = [
    // Histórico da Solicitação 101
    { id: 1, solicitacaoId: 101, deStatusId: null, paraStatusId: 1, criadoEm: '2025-08-15T08:12:00-03:00', usuarioId: 1, observacao: 'Cliente abriu a solicitação.' },
    { id: 2, solicitacaoId: 101, deStatusId: 1, paraStatusId: 2, criadoEm: '2025-08-16T10:00:00-03:00', usuarioId: 10, observacao: 'Orçamento: R$ 250,00 para troca do kit de roletes.' },
    { id: 3, solicitacaoId: 101, deStatusId: 2, paraStatusId: 4, criadoEm: '2025-08-17T11:00:00-03:00', usuarioId: 1, observacao: 'Orçamento aprovado pelo cliente.' },

    // Histórico da Solicitação 102
    { id: 4, solicitacaoId: 102, deStatusId: null, paraStatusId: 1, criadoEm: '2025-08-18T14:30:00-03:00', usuarioId: 1 },
    { id: 5, solicitacaoId: 102, deStatusId: 1, paraStatusId: 2, criadoEm: '2025-08-18T16:00:00-03:00', usuarioId: 11, observacao: 'Orçamento: R$ 450,00 para formatação e reinstalação do sistema.' },
    
    // Histórico da Solicitação 103
    { id: 6, solicitacaoId: 103, deStatusId: null, paraStatusId: 1, criadoEm: '2025-08-19T09:00:00-03:00', usuarioId: 2 },
  ];

  private findStatus(id: number): StatusSolicitacao {
    const st = this.statusCatalog.find((s) => s.id === id);
    if (!st) throw new Error(`Status com id ${id} não encontrado`);
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
        return {
          ...h,
          statusNome: status.nome,
          usuarioNome: usuario?.nome || 'Sistema'
        };
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

  listAbertasParaFuncionario(): Observable<ListItemRF011[]> {
    const statusAbertaId = 1; // ID do status "ABERTA"
    return of(this.solicitacoes).pipe(
      map(list =>
        list
          .filter(s => s.statusAtualId === statusAbertaId)
          .sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime())
          .map(s => {
            const cliente = this.usuarios.find(u => u.id === s.clienteId);
            const desc = s.descricaoEquipamento ?? '';
            return {
              solicitacaoId: s.id,
              dataHoraAbertura: s.criadoEm,
              nomeCliente: cliente?.nome || 'Cliente não encontrado',
              equipamentoDesc30: desc.length > 30 ? desc.slice(0, 30) + '...' : desc,
            };
          })
      )
    );
  }

  // ---- MÉTODOS ADICIONADOS PARA CORRIGIR O ERRO ----
  aprovarOrcamento(solicitacaoId: ID): Observable<boolean> {
    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (!solicitacao) {
      return of(false);
    }

    const deStatusId = solicitacao.statusAtualId;
    const paraStatusId = 4; // ID de "APROVADA"

    solicitacao.statusAtualId = paraStatusId;
    solicitacao.atualizadoEm = new Date().toISOString();

    this.historicos.push({
      id: this.historicos.length + 1,
      solicitacaoId: solicitacaoId,
      deStatusId: deStatusId,
      paraStatusId: paraStatusId,
      criadoEm: new Date().toISOString(),
      usuarioId: 1, // Simulando o cliente logado
      observacao: 'Orçamento aprovado pelo cliente.'
    });

    return of(true);
  }

  rejeitarOrcamento(solicitacaoId: ID, motivo: string): Observable<boolean> {
    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (!solicitacao) {
      return of(false);
    }

    const deStatusId = solicitacao.statusAtualId;
    const paraStatusId = 3; // ID de "REJEITA**DA"

    solicitacao.statusAtualId = paraStatusId;
    solicitacao.atualizadoEm = new Date().toISOString();

    this.historicos.push({
      id: this.historicos.length + 1,
      solicitacaoId: solicitacaoId,
      deStatusId: deStatusId,
      paraStatusId: paraStatusId,
      criadoEm: new Date().toISOString(),
      usuarioId: 1, // Simulando o cliente logado
      observacao: `Orçamento rejeitado. Motivo: ${motivo}`
    });

    return of(true);
  }
}