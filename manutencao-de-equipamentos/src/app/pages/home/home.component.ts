import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Solicitacao } from '../../models/solicitacao.model';

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
  private readonly router = inject(Router);

  itens: Solicitacao[] = [];
  clienteId = 1;
  carregando = true;
  erro: string | null = null;

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  private carregarSolicitacoes(): void {
    this.carregando = true;
    this.service.listByCliente(this.clienteId).subscribe({
      next: (data: Solicitacao[]) => {
        this.itens = data.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
        this.erro = null;
        this.carregando = false;
        console.log('Solicitações carregadas:', this.itens);
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar solicitações:', err);
        this.erro = 'Falha ao carregar suas solicitações. Tente novamente mais tarde.';
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

  statusNome(id: number): string {
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
  return map[id] ?? 'Desconhecido';
}
}
