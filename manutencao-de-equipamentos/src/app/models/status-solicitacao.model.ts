export interface StatusSolicitacao {
  id: number;
  codigo: string;
  nome: string;        
  requiresAction: boolean;
  actionType: string;
}

// Status pré-definidos (hardcoded)
export const STATUS_SOLICITACOES: StatusSolicitacao[] = [
  {
    id: 1,
    codigo: 'CRIADA',
    nome: 'Criada',
    requiresAction: false,
    actionType: 'NONE'
  },
  {
    id: 2,
    codigo: 'ORCADA',
    nome: 'Orçada',
    requiresAction: true,
    actionType: 'APPROVE_REJECT_BUDGET'
  },
  {
    id: 3,
    codigo: 'APROVADA',
    nome: 'Aprovada',
    requiresAction: false,
    actionType: 'NONE'
  },
  {
    id: 4,
    codigo: 'REJEITADA',
    nome: 'Rejeitada',
    requiresAction: false,
    actionType: 'NONE'
  },
  {
    id: 5,
    codigo: 'EM_EXEC',
    nome: 'Em execução',
    requiresAction: false,
    actionType: 'NONE'
  },
  {
    id: 6,
    codigo: 'CONCLUIDA',
    nome: 'Concluída',
    requiresAction: false,
    actionType: 'NONE'
  }
];
