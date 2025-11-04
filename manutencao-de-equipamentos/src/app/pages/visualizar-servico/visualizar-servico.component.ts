import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Solicitacao } from '../../models/solicitacao.model';
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

  solicitacao$?: Observable<Solicitacao>;
  orcamento$?: Observable<Orcamento>;
  solicitacaoId?: number;
  isProcessing = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoId = +idParam;
      this.solicitacao$ = this.service.getById(this.solicitacaoId);
      this.orcamento$ = this.service.getOrcamentoBySolicitacao(this.solicitacaoId);
    }
  }

  aprovarServico() {
    if (!this.solicitacaoId) return;
    
    this.isProcessing = true;
    this.service.aprovarOrcamento(this.solicitacaoId).subscribe({
      next: (success) => {
        if (success) {
          // Busca o valor do orçamento para mostrar na mensagem
          this.orcamento$?.subscribe(orcamento => {
            const valor = orcamento ? `R$ ${orcamento.valorTotal.toFixed(2)}` : 'R$ 0,00';
            alert(`Serviço Aprovado no Valor ${valor}`);
            this.router.navigate(['/home']); 
          });
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

  podeAprovarRejeitar(solicitacao: Solicitacao): boolean {
    return solicitacao.statusAtualId === 2; // Status ORÇADA
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
