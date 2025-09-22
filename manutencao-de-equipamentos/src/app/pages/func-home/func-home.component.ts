import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';

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
  private service = inject(SolicitacoesService);
  private router = inject(Router);

  itens: ItemFunc[] = [];
  carregando = signal(false);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.service.listParaFuncionarioEmAberto().subscribe({
      next: (data) => {
        this.itens = data;
        this.erro.set(null);
        this.carregando.set(false);
        console.log('Solicitações em aberto (funcionário):', data);
      },
      error: (err) => {
        console.error(err);
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

  trackById = (_: number, item: ItemFunc) => item.solicitacaoId;
}
