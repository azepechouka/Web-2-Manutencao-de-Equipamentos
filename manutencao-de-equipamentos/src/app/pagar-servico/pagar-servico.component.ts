import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../services/solicitacoes.service';
import { SolicitacaoResponse } from '../models/solicitacao.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagar-servico.component.html',
  styleUrls: ['./pagar-servico.component.css'],
})
export class PagarServicoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacoesService = inject(SolicitacoesService);
  private readonly auth = inject(AuthService);

  solicitacao?: SolicitacaoResponse;
  solicitacaoId!: number;
  isLoading = true;
  isProcessing = false;
  erro: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoId = Number(idParam);
      this.carregarSolicitacao();
    }
  }

  private carregarSolicitacao(): void {
    this.isLoading = true;
    this.solicitacoesService.getById(this.solicitacaoId).subscribe({
      next: (s) => {
        this.solicitacao = s;
        this.isLoading = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar a solicitação.';
        this.isLoading = false;
      },
    });
  }

  pagarServico(): void {
    if (!this.solicitacaoId) return;
    if (!confirm('Deseja realmente marcar esta solicitação como PAGA?')) return;

    const usuarioId = this.auth.getUsuarioId();
    if (!usuarioId) {
      alert('Usuário não identificado!');
      return;
    }

    this.isProcessing = true;

    this.solicitacoesService.pagar(this.solicitacaoId, usuarioId).subscribe({
      next: (success) => {
        this.isProcessing = false;
        if (success) {
          alert('💸 Serviço marcado como PAGO com sucesso!');
          this.router.navigate(['/home']);
        } else {
          alert('Falha ao atualizar o estado da solicitação.');
        }
      },
      error: () => {
        this.isProcessing = false;
        alert('Erro ao processar pagamento.');
      },
    });
  }
}
