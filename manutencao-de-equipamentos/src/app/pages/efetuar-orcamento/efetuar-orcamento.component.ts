import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { SolicitacaoResponse } from '../../models/solicitacao.model';
import { UsuarioResponse } from '../../models/usuario.model';

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
  private usuarioSvc = inject(UsuarioService);

  solicitacaoId!: number;
  solicitacao = signal<SolicitacaoResponse | null>(null);
  cliente = signal<any | null>(null);
  funcionario = signal<UsuarioResponse | null>(null);
  erro = signal<string | null>(null);
  carregando = signal(true);

  form = this.fb.group({
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
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

    const funcionarioId = this.auth.getUsuarioId();
    if (funcionarioId) {
      this.usuarioSvc.getById(funcionarioId).subscribe({
        next: (user) => this.funcionario.set(user),
        error: (err) => {
          console.error(err);
          this.funcionario.set(null);
        },
      });
    }

    this.svc.getById(id).subscribe({
      next: (det: SolicitacaoResponse) => {
        if (!det) {
          this.erro.set('Solicitação não encontrada.');
          this.carregando.set(false);
          return;
        }

        this.solicitacao.set(det);

        if (det.clienteId) {
          this.usuarioSvc.getById(det.clienteId).subscribe((cli) => {
            this.cliente.set(cli ?? null);
          });
        }
        this.carregando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.erro.set('Falha ao carregar dados.');
        this.carregando.set(false);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid || !this.solicitacao()) {
      this.form.markAllAsTouched();
      return;
    }

    const funcionarioId = this.auth.getUsuarioId();
    if (!funcionarioId) {
      alert('Nenhum funcionário logado. Faça login como FUNCIONÁRIO.');
      return;
    }

    const { valor, observacao } = this.form.value;

    this.svc
      .efetuarOrcamento({
        solicitacaoId: this.solicitacaoId,
        valor: Number(valor),
        funcionarioId,
        observacao: observacao || undefined,
      })
      .subscribe({
        next: (orc) => {
          console.log('Orçamento registrado:', orc);
          alert('Orçamento registrado com sucesso!');
          this.router.navigate(['/func-home']);
        },
        error: (err) => {
          console.error(err);
          alert('Falha ao registrar orçamento.');
        },
      });
  }

  traduzStatus(id?: number): string {
    const mapa: Record<number, string> = {
      1: 'ABERTA',
      2: 'ORÇADA',
      3: 'APROVADA',
      4: 'REJEITADA',
      5: 'FINALIZADA',
    };
    return mapa[id ?? 0] || '—';
  }

  getStatusCor(estado: string): string {
    const mapa: Record<string, string> = {
      Aberta: '#6c757d',
      Orçada: '#8B4513',
      Aprovada: '#FFD700',
      Rejeitada: '#DC3545',
      Redirecionada: '#800080',
      Arrumada: '#0D6EFD',
      Paga: '#FF8C00',
      Finalizada: '#28A745',
    };
    return mapa[estado] ?? '#999999';
  }
}
