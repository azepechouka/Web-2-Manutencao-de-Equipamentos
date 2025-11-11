import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { AuthService } from '../../services/auth.service';
import { SolicitacaoResponse } from '../../models/solicitacao.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  private readonly service = inject(SolicitacoesService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  itens: SolicitacaoResponse[] = [];
  carregando = true;
  erro: string | null = null;

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  private carregarSolicitacoes(): void {
    this.carregando = true;

    const clienteId = this.auth.getUsuarioId();

    if (!clienteId) {
      this.erro = 'Nenhum usuário autenticado. Faça login novamente.';
      this.carregando = false;
      return;
    }

    this.service.listByCliente(clienteId).subscribe({
      next: (data: SolicitacaoResponse[]) => {
        this.itens = data.sort(
          (a, b) =>
            new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
        );
        this.erro = null;
        this.carregando = false;
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar solicitações:', err);
        this.erro =
          'Falha ao carregar suas solicitações. Tente novamente mais tarde.';
        this.carregando = false;
      },
    });
  }

  verSolicitacao(id: number): void {
    this.router.navigate(['/solicitacao', id]);
  }

  abrirOrcamento(id: number): void {
    this.router.navigate(['/visualizar-servico', id]);
  }

  getStatusCor(estado: string): string {
    const mapa: Record<string, string> = {
      'Aberta': '#6c757d',        // Cinza
      'Orçada': '#8B4513',        // Marrom
      'Aprovada': '#FFD700',      // Amarelo
      'Rejeitada': '#DC3545',     // Vermelho
      'Redirecionada': '#800080', // Roxo
      'Arrumada': '#0D6EFD',      // Azul
      'Paga': '#FF8C00',          // Alaranjado
      'Finalizada': '#28A745',    // Verde
    };
    return mapa[estado] ?? '#999999';
  }
}
