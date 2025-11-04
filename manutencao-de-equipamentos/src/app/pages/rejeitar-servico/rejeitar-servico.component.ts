import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Solicitacao } from '../../models/solicitacao.model';
import { Orcamento } from '../../models/orcamento.model';

@Component({
  selector: 'app-rejeitar-servico',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './rejeitar-servico.component.html',
  styleUrls: ['./rejeitar-servico.component.css']
})
export class RejeitarServicoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(SolicitacoesService);
  private readonly router = inject(Router);

  solicitacao$?: Observable<Solicitacao>;
  orcamento$?: Observable<Orcamento>;
  solicitacaoId?: number;

  motivoRejeicao = '';
  isProcessing = false;
  maxLength = 500;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoId = +idParam;
      this.solicitacao$ = this.service.getById(this.solicitacaoId);
      this.orcamento$ = this.service.getOrcamentoBySolicitacao(this.solicitacaoId);
    }
  }

  confirmarRejeicao(): void {
    if (!this.motivoRejeicao.trim()) {
      alert('Por favor, informe o motivo da rejeição.');
      return;
    }

    if (!this.solicitacaoId) {
      alert('Solicitação inválida.');
      return;
    }

    this.isProcessing = true;

    this.service.rejeitarOrcamento(this.solicitacaoId, this.motivoRejeicao.trim()).subscribe({
      next: (success: boolean) => {
        this.isProcessing = false;
        if (success) {
          alert('Serviço rejeitado com sucesso.');
          this.router.navigate(['/home']);
        } else {
          alert('Não foi possível rejeitar o serviço.');
        }
      },
      error: (err: unknown) => {
        console.error('Erro ao rejeitar serviço:', err);
        this.isProcessing = false;
        alert('Erro ao rejeitar o serviço. Tente novamente.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }

  get caracteresRestantes(): number {
    return this.maxLength - this.motivoRejeicao.length;
  }
}
