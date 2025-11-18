import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { SolicitacaoResponse } from '../../models/solicitacao.model';
import { HistoricoStatusDTO } from '../../models/historico-status.model';
import { Orcamento } from '../../models/orcamento.model';
import { AuthService } from '../../services/auth.service';

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
  private readonly auth = inject(AuthService);

  solicitacao?: SolicitacaoResponse;
  historico: HistoricoStatusDTO[] = [];
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
      next: (sol: SolicitacaoResponse) => {
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

  rejeitarServico() {
    if (this.solicitacaoId) {
      this.router.navigate(['/rejeitar-servico', this.solicitacaoId]);
    }
  }

  podeAprovarRejeitar(s: SolicitacaoResponse): boolean {
    return s.estadoAtual === 'Orçada';
  }

  getStatusCor(estado: string): string {
    const mapa: Record<string, string> = {
      'Aberta': '#6c757d',       
      'Orçada': '#8B4513',        
      'Aprovada': '#FFD700',      
      'Rejeitada': '#DC3545',     
      'Redirecionada': '#800080', 
      'Arrumada': '#0D6EFD',      
      'Paga': '#FF8C00',          
      'Finalizada': '#28A745'     
    };
    return mapa[estado] ?? '#999999';
  }
}
