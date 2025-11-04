import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Solicitacao } from '../../models/solicitacao.model';

type ItemFunc = {
  solicitacaoId: number;
  dataHoraSolicitacao: string;
  clienteNome: string;
  equipamentoDesc30: string;
};

@Component({
  selector: 'app-func-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './func-home.component.html',
  styleUrls: ['./func-home.component.css']
})
export class FuncHomeComponent implements OnInit {
  private readonly service = inject(SolicitacoesService);
  private readonly router = inject(Router);

  itens: ItemFunc[] = [];
  carregando = signal(false);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.service.listEmAberto().subscribe({
      next: (data: Solicitacao[]) => {
        this.itens = data.map((s) => ({
          solicitacaoId: s.id,
          dataHoraSolicitacao: s.criadoEm,
          clienteNome: `Cliente #${s.clienteId}`,
          equipamentoDesc30: s.descricaoEquipamento.length > 30
            ? s.descricaoEquipamento.slice(0, 30) + '...'
            : s.descricaoEquipamento,
        }));
        this.erro.set(null);
        this.carregando.set(false);
        console.log('Solicitações em aberto (funcionário):', this.itens);
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar solicitações em aberto:', err);
        this.erro.set('Falha ao carregar solicitações.');
        this.carregando.set(false);
      },
    });
  }

  efetuarOrcamento(id: number): void {
    this.router.navigate(['/efetuar-orcamento', id]);
  }

  verSolicitacao(id: number): void {
    this.router.navigate(['/solicitacao', id]);
  }

  trackById = (_: number, item: ItemFunc): number => item.solicitacaoId;
}
