import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../services/solicitacoes.service';
import { SolicitacaoResponse } from '../models/solicitacao.model';
import { UsuarioService } from '../services/usuario.service';
import { Orcamento } from '../models/orcamento.model';
import { UsuarioResponse } from '../models/usuario.model';
import { OrcamentosService } from '../services/orcamento.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mostrar-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './mostrar-orcamento.component.html',
  styleUrls: ['./mostrar-orcamento.component.css']
})
export class MostrarOrcamentoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly solicitacoesService = inject(SolicitacoesService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly orcamentos = inject(OrcamentosService);
  private readonly auth = inject(AuthService);

  solicitacao?: SolicitacaoResponse;
  orcamento?: Orcamento;
  usuario?: UsuarioResponse;

  solicitacaoId!: number;
  isLoading = true;
  isProcessing = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoId = Number(idParam);
      this.carregarDados();
    }
  }

  private carregarDados(): void {
    this.isLoading = true;

    this.solicitacoesService.getById(this.solicitacaoId).subscribe({
      next: (s) => {
        this.solicitacao = s;
        this.carregarOrcamento();
        if (s.clienteId) this.carregarUsuario(s.clienteId);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Erro ao carregar a solicitação.');
        this.router.navigate(['/home']);
      }
    });
  }

  private carregarOrcamento(): void {
    this.solicitacoesService.getOrcamentoBySolicitacao(this.solicitacaoId).subscribe({
      next: (orc) => (this.orcamento = orc),
      error: () => console.warn('Nenhum orçamento encontrado para esta solicitação.')
    });
  }

  private carregarUsuario(usuarioId: number): void {
    this.usuarioService.getById(usuarioId).subscribe({
      next: (u) => (this.usuario = u),
      error: () => console.warn('Erro ao carregar dados do cliente.')
    });
  }

  aceitarOrcamento(): void {
    if (!this.solicitacaoId) return;

    const usuarioId = this.auth.getUsuarioId();
    if (!usuarioId) {
      alert('Usuário não identificado!');
      return;
    }

    this.isProcessing = true;

    this.solicitacoesService.aprovarOrcamento(this.solicitacaoId, usuarioId).subscribe({
      next: (success) => {
        this.isProcessing = false;
        if (success) {
          alert('Orçamento aprovado com sucesso!');
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.isProcessing = false;
        alert('Erro ao aprovar o orçamento.');
      }
    });
  }

  recusarOrcamento(): void {
    if (this.solicitacaoId) {
      this.router.navigate(['/rejeitar-servico', this.solicitacaoId]);
    }
  }
}