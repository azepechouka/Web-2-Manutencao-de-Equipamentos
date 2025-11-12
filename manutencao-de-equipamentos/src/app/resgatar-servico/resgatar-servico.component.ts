import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../services/solicitacoes.service';
import { SolicitacaoResponse } from '../models/solicitacao.model';

@Component({
  selector: 'app-resgatar-servico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resgatar-servico.component.html',
  styleUrls: ['./resgatar-servico.component.css']
})
export class ResgatarServicoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(SolicitacoesService);
  private readonly router = inject(Router);

  solicitacao?: SolicitacaoResponse;
  solicitacaoId!: number;

  isLoading = true;
  isProcessing = false;
  erro?: string;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoId = Number(idParam);
      this.carregarSolicitacao();
    }
  }

  private carregarSolicitacao(): void {
    this.isLoading = true;
    this.service.getById(this.solicitacaoId).subscribe({
      next: (s) => {
        this.solicitacao = s;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.erro = 'Erro ao carregar dados da solicitação.';
      }
    });
  }

  confirmarResgate(): void {
    if (!confirm('Deseja realmente resgatar esta solicitação rejeitada?')) return;

    this.isProcessing = true;
    this.service.resgatarSolicitacao(this.solicitacaoId).subscribe({
      next: (ok) => {
        this.isProcessing = false;
        if (ok) {
          alert('Solicitação resgatada com sucesso! Ela retornou ao fluxo como APROVADA.');
          this.router.navigate(['/home']);
        } else {
          alert('Não foi possível resgatar a solicitação.');
        }
      },
      error: () => {
        this.isProcessing = false;
        alert('Erro ao tentar resgatar a solicitação.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
