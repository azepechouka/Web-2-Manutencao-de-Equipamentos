// src/app/services/solicitacoes.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';
import { Orcamento } from '../models/orcamento.model';
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
  {
    id: 1,
    nome: 'João Cliente',
    email: 'joao.cliente@empresa.com',
    cpf: '11111111111',
    telefone: '(11) 90000-0001',
    endereco: {
      cep: '01001000',
      logradouro: 'Praça da Sé',
      numero: '100',
      complemento: 'Ap 12',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
    },
    perfil: 'CLIENTE',
    ativo: true,
    criadoEm: '2025-01-01T09:00:00-03:00',
  },
  {
    id: 10,
    nome: 'Maria Funcionária',
    email: 'maria.funcionaria@empresa.com',
    cpf: '22222222222',
    telefone: '(11) 90000-0002',
    endereco: {
      cep: '01311000',
      logradouro: 'Av. Paulista',
      numero: '1578',
      complemento: 'Conj. 501',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
    },
    perfil: 'FUNCIONARIO',
    ativo: true,
    criadoEm: '2025-01-02T10:00:00-03:00',
  },
  {
    id: 11,
    nome: 'Mário Funcionário',
    email: 'mario.funcionario@empresa.com',
    cpf: '33333333333',
    telefone: '(11) 90000-0003',
    endereco: {
      cep: '04094002',
      logradouro: 'Av. Ibirapuera',
      numero: '3000',
      complemento: null,
      bairro: 'Moema',
      localidade: 'São Paulo',
      uf: 'SP',
    },
    perfil: 'FUNCIONARIO',
    ativo: true,
    criadoEm: '2025-01-03T11:00:00-03:00',
  },
];

  private solicitacoes: Solicitacao[] = [
    {
      id: 101,
      clienteId: 1,
      descricaoEquipamento: 'Impressora LaserJet Pro 400 MFP M425dn',
      descricaoProblema: 'Não puxa papel e aparece erro 13.20.00 na tela principal. Já tentei reiniciar e o problema persiste.',
      criadoEm: '2025-08-15T08:12:00-03:00',
      statusAtualId: 2, // ORÇADA
      atualizadoEm: '2025-08-16T10:00:00-03:00',
    },
    {
      id: 102,
      clienteId: 1,
      descricaoEquipamento: 'Notebook Dell Latitude 5490',
      descricaoProblema: 'Superaquecendo e desligando sozinho após alguns minutos de uso.',
      criadoEm: '2025-08-20T14:20:00-03:00',
      statusAtualId: 1, // CRIADA
      atualizadoEm: '2025-08-20T14:20:00-03:00',
    },
    {
      id: 103,
      clienteId: 1,
      descricaoEquipamento: 'Ar-condicionado Split Samsung 12k BTU',
      descricaoProblema: 'Não gela. Indicador pisca com código de erro intermitente.',
      criadoEm: '2025-08-22T09:05:00-03:00',
      statusAtualId: 2, // ORÇADA
      atualizadoEm: '2025-08-22T15:30:00-03:00',
    },
    {
      id: 104,
      clienteId: 1,
      descricaoEquipamento: 'Notebook Lenovo ThinkPad T480',
      descricaoProblema: 'Teclas “E” e “R” falhando com frequência, mesmo após limpeza.',
      criadoEm: '2025-08-25T11:45:00-03:00',
      statusAtualId: 3, // APROVADA
      atualizadoEm: '2025-08-26T10:10:00-03:00',
    },
    {
      id: 105,
      clienteId: 1,
      descricaoEquipamento: 'Furadeira de Bancada Bosch PBD 40',
      descricaoProblema: 'Ruído alto no motor e vibração excessiva durante o uso.',
      criadoEm: '2025-08-28T16:20:00-03:00',
      statusAtualId: 4, // REJEITADA
      atualizadoEm: '2025-08-29T09:00:00-03:00',
    },
    {
      id: 106,
      clienteId: 1,
      descricaoEquipamento: 'Impressora Epson EcoTank L3150',
      descricaoProblema: 'Impressões saindo com listras horizontais mesmo após limpeza de cabeçote.',
      criadoEm: '2025-09-01T08:00:00-03:00',
      statusAtualId: 5, // EM EXECUÇÃO
      atualizadoEm: '2025-09-03T14:45:00-03:00',
    },
    {
      id: 107,
      clienteId: 1,
      descricaoEquipamento: 'Nobreak APC Back-UPS 1500VA',
      descricaoProblema: 'Apita constantemente; suspeita de bateria com baixa capacidade.',
      criadoEm: '2025-09-02T10:30:00-03:00',
      statusAtualId: 6, // CONCLUÍDA
      atualizadoEm: '2025-09-10T17:25:00-03:00',
    },
    {
      id: 108,
      clienteId: 1,
      descricaoEquipamento: 'Roteador TP-Link Archer C6',
      descricaoProblema: 'Quedas de conexão Wi-Fi e perda de velocidade ao longo do dia.',
      criadoEm: '2025-09-12T13:05:00-03:00',
      statusAtualId: 1, // CRIADA
      atualizadoEm: '2025-09-12T13:05:00-03:00',
    },
    {
      id: 109,
      clienteId: 1,
      descricaoEquipamento: 'Scanner Canon DR-C225',
      descricaoProblema: 'Puxando papel torto; digitalizações desalinhadas.',
      criadoEm: '2025-09-15T09:50:00-03:00',
      statusAtualId: 2, // ORÇADA
      atualizadoEm: '2025-09-15T12:40:00-03:00',
    },
    {
      id: 110,
      clienteId: 1,
      descricaoEquipamento: 'Projetor Epson PowerLite X41',
      descricaoProblema: 'Sem imagem; lâmpada acende e apaga após alguns segundos.',
      criadoEm: '2025-10-01T15:12:00-03:00',
      statusAtualId: 2, // ORÇADA
      atualizadoEm: '2025-10-02T10:00:00-03:00',
    },
  ];


  private historicos: HistoricoStatus[] = [
    { id: 1, solicitacaoId: 101, deStatusId: null, paraStatusId: 1, criadoEm: '2025-08-15T08:12:00-03:00', usuarioId: 1 },
    { id: 2, solicitacaoId: 101, deStatusId: 1, paraStatusId: 2, criadoEm: '2025-08-16T10:00:00-03:00', usuarioId: 10, observacao: 'Orçamento: R$ 250,00' },
  ];

  private orcamentos: Orcamento[] = [
    {
      id: 1,
      solicitacaoId: 101,
      valorTotal: 250.00,
      moeda: 'BRL',
      observacao: 'Substituição do conjunto de roletes e limpeza interna',
      criadoEm: '2025-08-16T10:00:00-03:00'
    }
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

  // Métodos para aprovar/rejeitar orçamentos
  aprovarOrcamento(solicitacaoId: ID): Observable<boolean> {
    // Simula aprovação do orçamento
    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (solicitacao) {
      solicitacao.statusAtualId = 3; // APROVADA
      solicitacao.atualizadoEm = new Date().toISOString();
      
      // Adiciona ao histórico
      this.historicos.push({
        id: Date.now(),
        solicitacaoId: solicitacaoId,
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
    // Simula rejeição do orçamento
    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (solicitacao) {
      solicitacao.statusAtualId = 4; // REJEITADA
      solicitacao.atualizadoEm = new Date().toISOString();
      
      // Adiciona ao histórico
      this.historicos.push({
        id: Date.now(),
        solicitacaoId: solicitacaoId,
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

  // Método para buscar orçamento de uma solicitação
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
    // Quais códigos considerar como "em aberto" para o FUNCIONÁRIO
    const codigosAbertos = new Set(['ABERTA']);

    // Mapeia para IDs existentes no catálogo (tolerante a caixa)
    const idsAbertos = this.statusCatalog
      .filter(s => codigosAbertos.has(s.codigo?.toUpperCase?.()))
      .map(s => s.id);

    // Fallback: se não achar nada (p.ex., não há ABERTA no catálogo), usa o id de CRIADA (id=1 no seu seed)
    const idsSet = new Set<number>(idsAbertos.length ? idsAbertos : [1]);

    return of(this.solicitacoes).pipe(
      map(list =>
        list
          .filter(s => idsSet.has(s.statusAtualId))
          // mais recente primeiro
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

  /** efetuar orçamento (cria orçamento, move para ORÇADA, registra histórico com funcionário logado) */
  efetuarOrcamento(params: {
    solicitacaoId: number;
    valorTotal: number;
    funcionarioId: number;
    observacao?: string;
    moeda?: string; 
  }) {
    const { solicitacaoId, valorTotal, funcionarioId, observacao, moeda = 'BRL' } = params;

    const solicitacao = this.solicitacoes.find(s => s.id === solicitacaoId);
    if (!solicitacao) throw new Error('Solicitação não encontrada');

    const deStatusId = solicitacao.statusAtualId;
    const stOrcada = this.statusCatalog.find(s => s.codigo?.toUpperCase() === 'ORCADA');
    const paraStatusId = stOrcada?.id ?? 2; // fallback para id=2

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
    statusCodigo: string; // ex.: 'CRIADA', 'ORCADA', ...
    statusNome: string;   // ex.: 'Criada', 'Orçada', ...
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
}