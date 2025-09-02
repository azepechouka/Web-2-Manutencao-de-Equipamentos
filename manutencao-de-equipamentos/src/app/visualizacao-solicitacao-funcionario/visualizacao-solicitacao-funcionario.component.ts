import { JsonPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitacao } from '../models/solicitacao.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-visualizacao-solicitacoes',
  standalone: true,
  // providers: [
  //   provideNativeDateAdapter(),
  // ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './visualizacao-solicitacao-funcionario.component.html',
  styleUrls: ['./visualizacao-solicitacao-funcionario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizacaoSolicitacaoFuncionarioComponent {
  
  solicitacao = {
        "id": 1,
        "dataHora": "2025-09-02 20:34:12",
        "descricao": "Problema técnico com Servidor",
        "nomeCliente": "Pedro Souza",
        "estado": "ARRUMADA",
        "historico": [
            {
                "dataHora": "2025-09-02 20:34:12",
                "descricao": "Solicitação criada"
            }
        ],
        "valor": null,
        "cliente": "Pedro Souza",
        "emailCliente": "pedro.souza@example.com",
        "categoria": "Desktop",
        "orcamentoFeitoPor": 2,
        "dataOrcamento": "2025-09-02 20:34:12"
  };


  solicitacoes: Solicitacao[] = [];
  solicitacoesFiltradas: Solicitacao[] = [];
  paginaAtual: number = 1;
  itensPorPagina: number = 20;
  mostrarFiltroPeriodo = false;

  filtroSelecionado: string = 'TODOS';

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // constructor() {
  //   this.carregarSolicitacoes();
  // }
  

  // carregarSolicitacoes() {
  //   this.solicitacoes = solicitacoesJson.map((solicitacao: any) => ({
  //     ...solicitacao,
  //     cliente: solicitacao.nomeCliente || 'Cliente Desconhecido',
  //   }));
  
  //   // Ordena as solicitações por data/hora em ordem crescente
  //   this.solicitacoes.sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  
  //   this.solicitacoesFiltradas = this.solicitacoes;
  //   this.range.valueChanges.subscribe(() => this.filtrarPorPeriodo());
  // }

  onFiltroChange() {
    switch (this.filtroSelecionado) {
      case 'HOJE':
        this.filtrarHoje(); // Filtra para mostrar apenas as solicitações do dia atual
        break;
      case 'TODOS':
        this.filtrarTodos(); // Mostra todas as solicitações
        this.range.setValue({ start: null, end: null }); // Limpa o filtro de data
        break;
      case 'PERIODO':
        this.filtrarPorPeriodo(); // Aplica o filtro por período
        break;
    }
  }
  

  filtrarPorPeriodo() {
    const inicio = this.range.value?.start;
    const fim = this.range.value?.end;
  
    if (inicio && fim) {
      const fimCorrigido = new Date(fim);
      fimCorrigido.setDate(fimCorrigido.getDate() + 1);
  
      this.solicitacoesFiltradas = this.solicitacoes.filter(solicitacao => {
        const dataSolicitacao = new Date(solicitacao.criadoEm);
        return dataSolicitacao >= inicio && dataSolicitacao < fimCorrigido;
      });

      // this.solicitacoesFiltradas.sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  
    } else {
      this.solicitacoesFiltradas = this.solicitacoes; // Se não houver data, mostra todas as solicitações
    }
  }

  filtrarHoje() {
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
  
    // Define a data do range para hoje
    this.range.setValue({ start: inicioHoje, end: fimHoje });
    
    // // Filtra as solicitações para mostrar apenas as do dia atual
    // this.solicitacoesFiltradas = this.solicitacoes.filter(solicitacao => {
    //   const dataSolicitacao = new Date(solicitacao.dataHora);
    //   return dataSolicitacao >= inicioHoje && dataSolicitacao <= fimHoje;
    // });

    // this.solicitacoesFiltradas.sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

    this.paginaAtual = 1; // Reseta a página para a primeira
  }

  filtrarTodos() {
    this.solicitacoesFiltradas = this.solicitacoes;
    this.paginaAtual = 1;
    this.range.setValue({ start: null, end: null });
  }

  obterSolicitacoesPorPagina() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.solicitacoesFiltradas.slice(inicio, fim);
  }

  efetuarOrcamento(solicitacao: Solicitacao) {
    alert('RF012 - Efetuar Orçamento');
  }

  efetuarManutencao(solicitacao: Solicitacao) {
    alert('RF014 - Efetuar Manutenção');
  }

  finalizarSolicitacao(solicitacao: Solicitacao) {
    alert('RF016 - Finalizar Solicitação');
  }

  voltarPaginaInicial() {
    window.location.href = '/pagina-inicial-funcionario';
  }

  proximaPagina() {
    this.paginaAtual++;
  }

  paginaAnterior() {
    this.paginaAtual--;
  }
}