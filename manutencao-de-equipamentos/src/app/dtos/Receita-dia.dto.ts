import { SolicitacaoResponse } from "../models/solicitacao.model";

export interface ReceitaDia {
  data: string;
  totalReceita: number;
  quantidadeServicos: number;
  solicitacoes: SolicitacaoResponse[];
}