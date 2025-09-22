import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService, DetalheSolicitacao } from '../../services/solicitacoes.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './efetuar-orcamento.component.html',
})
export class EfetuarOrcamentoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private svc = inject(SolicitacoesService);
  private auth = inject(AuthService);

  solicitacaoId!: number;
  detalhe = signal<DetalheSolicitacao | null>(null);
  cliente = signal<any | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  form = this.fb.group({
    valorTotal: [null as number | null, [Validators.required, Validators.min(0.01)]],
    observacao: ['' as string],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.erro.set('Solicitação inválida.');
      this.carregando.set(false);
      return;
    }
    this.solicitacaoId = id;

    this.svc.getById(id).subscribe({
      next: det => {
        if (!det) {
          this.erro.set('Solicitação não encontrada.');
          this.carregando.set(false);
          return;
        }
        this.detalhe.set(det);
        this.svc.getClienteById$(det.clienteId).subscribe(cli => this.cliente.set(cli ?? null));
        this.carregando.set(false);
      },
      error: err => {
        console.error(err);
        this.erro.set('Falha ao carregar dados.');
        this.carregando.set(false);
      }
    });
  }

  salvar(): void {
    if (this.form.invalid || !this.detalhe()) {
      this.form.markAllAsTouched();
      return;
    }

    const funcionarioId = this.auth.getUsuarioId();
    if (!funcionarioId) {
      alert('Nenhum funcionário logado. Faça login como FUNCIONÁRIO.');
      return;
    }

    const { valorTotal, observacao } = this.form.value;
    this.svc.efetuarOrcamento({
      solicitacaoId: this.solicitacaoId,
      valorTotal: Number(valorTotal),
      funcionarioId,
      observacao: observacao || undefined,
      moeda: 'BRL',
    }).subscribe({
      next: (orc) => {
        console.log('Orçamento registrado:', orc);
        alert('Orçamento registrado com sucesso!');
        // navega para os detalhes da solicitação ou home do funcionário
        this.router.navigate(['/solicitacao', this.solicitacaoId]);
      },
      error: (err) => {
        console.error(err);
        alert('Falha ao registrar orçamento.');
      }
    });
  }
}