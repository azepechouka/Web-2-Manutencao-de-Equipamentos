import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Solicitacao } from '../../models/solicitacao.model';
import { HistoricoStatus } from '../../models/historico-status.model';
import { Orcamento } from '../../models/orcamento.model';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './visualizar-servico.component.html',
  styleUrls: ['./visualizar-servico.component.css']
})
export class VisualizarServicoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(SolicitacoesService);
  private router = inject(Router);

  solicitacao?: Solicitacao;
  historico: HistoricoStatus[] = [];
  orcamento?: Orcamento;

  solicitacaoId?: number;
  isLoading = true;
  isProcessing = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoId = +idParam;
      this.carregarDados();
    }
  }

  private carregarDados() {
    this.isLoading = true;

    this.service.getById(this.solicitacaoId!).subscribe({
      next: (sol) => {
        this.solicitacao = sol;
        this.carregarOrcamento();
        this.carregarHistorico();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Erro ao carregar a solicitação.');
        this.router.navigate(['/home']);
      }
    });
  }

  private carregarHistorico() {
    this.service.getHistoricoBySolicitacao(this.solicitacaoId!).subscribe({
      next: (h) => (this.historico = h),
      error: () => console.warn('Nenhum histórico encontrado.')
    });
  }

  private carregarOrcamento() {
    this.service.getOrcamentoBySolicitacao(this.solicitacaoId!).subscribe({
      next: (orc) => (this.orcamento = orc),
      error: () => console.warn('Nenhum orçamento encontrado.')
    });
  }

  aprovarServico() {
    if (!this.solicitacaoId) return;

    this.isProcessing = true;
    this.service.aprovarOrcamento(this.solicitacaoId).subscribe({
      next: (success) => {
        if (success) {
          const valor = this.orcamento
            ? `R$ ${this.orcamento.valorTotal.toFixed(2)}`
            : 'R$ 0,00';
          alert(`Serviço Aprovado no Valor ${valor}`);
          this.router.navigate(['/home']);
        }
        this.isProcessing = false;
      },
      error: () => {
        this.isProcessing = false;
        alert('Erro ao aprovar o serviço. Tente novamente.');
      }
    });
  }

  rejeitarServico() {
    if (this.solicitacaoId) {
      this.router.navigate(['/rejeitar-servico', this.solicitacaoId]);
    }
  }

  podeAprovarRejeitar(s: Solicitacao): boolean {
    return s.statusAtualId === 2;
  }

  statusNome(statusId: number): string {
    const map: Record<number, string> = {
      1: 'Aberta',
      2: 'Orçada',
      3: 'Aprovada',
      4: 'Rejeitada',
      5: 'Redirecionada',
      6: 'Arrumada',
      7: 'Paga',
      8: 'Finalizada',
    };
    return map[statusId] ?? 'Desconhecido';
  }
}
