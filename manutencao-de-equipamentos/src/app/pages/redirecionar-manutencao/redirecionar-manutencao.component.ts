import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { FuncionariosService } from '../../services/funcionarios.service';
import { AuthService } from '../../services/auth.service';
import { SolicitacaoResponse } from '../../models/solicitacao.model';
import { Usuario } from '../../models/usuario.model';

type RedirHist = { dataHora: string; origem: string; destino: string; motivo?: string };

@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrls: ['./redirecionar-manutencao.component.css']
})
export class RedirecionarManutencaoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacoes = inject(SolicitacoesService);
  private readonly funcionariosSvc = inject(FuncionariosService);
  private readonly auth = inject(AuthService);

  solicitacaoId!: number;
  solicitacao?: SolicitacaoResponse;
  cliente: any = null;

  funcionarios: Usuario[] = [];
  funcionarioDestinoId?: number;
  funcionarioOrigem = '';

  motivoRedirecionamento = '';
  mensagem = '';
  historicoRedirecionamento: RedirHist[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('solicitacao');
    const id = Number(raw);
    if (!id || isNaN(id)) {
      this.error = 'Solicitação inválida.';
      return;
    }
    this.solicitacaoId = id;
    this.carregarSolicitacao();
    this.carregarFuncionarios();
  }

  private carregarSolicitacao(): void {
    this.loading = true;
    this.solicitacoes.getById(this.solicitacaoId).subscribe({
      next: (det: SolicitacaoResponse) => {
        this.solicitacao = det;
        this.loading = false;
      },
      error: () => {
        this.error = 'Falha ao carregar os dados da solicitação.';
        this.loading = false;
      },
    });
  }

  private carregarFuncionarios(): void {
    const usuarioLogadoId = this.auth.getUsuarioId();
    this.funcionariosSvc.list$().subscribe({
      next: (lista) => {
        // 🔥 Remove o usuário logado da lista
        this.funcionarios = lista.filter(f => f.id !== usuarioLogadoId);
      },
      error: () => (this.error = 'Falha ao carregar lista de funcionários.')
    });
  }

  redirecionarManutencao(): void {
    this.mensagem = '';
    this.error = null;

    if (!this.funcionarioDestinoId) {
      this.mensagem = 'Por favor, selecione um funcionário para redirecionar a manutenção.';
      return;
    }

    if (!this.motivoRedirecionamento.trim()) {
      this.mensagem = 'Por favor, informe o motivo do redirecionamento.';
      return;
    }

    const destino = this.funcionarios.find(f => f.id === this.funcionarioDestinoId);
    const origem = this.funcionarioOrigem || 'Funcionário atual';

    if (!destino || destino.nome === origem) {
      this.mensagem = 'Erro: não é possível redirecionar para o mesmo funcionário.';
      return;
    }

    const usuarioId = this.auth.getUsuarioId(); 

    if (!usuarioId) {
      this.mensagem = 'Erro: usuário não autenticado.';
      return;
    }

    this.solicitacoes.redirecionarManutencao(this.solicitacaoId, this.motivoRedirecionamento.trim(), this.funcionarioDestinoId)
      .subscribe({
        next: () => {
          const agora = new Date();
          this.historicoRedirecionamento.push({
            dataHora: `${agora.toLocaleDateString()} ${agora.toLocaleTimeString()}`,
            origem,
            destino: destino.nome,
            motivo: this.motivoRedirecionamento.trim(),
          });
          this.funcionarioOrigem = destino.nome;
          this.funcionarioDestinoId = undefined;
          this.motivoRedirecionamento = '';
          this.mensagem = 'Manutenção redirecionada com sucesso.';
        },
        error: () => {
          this.mensagem = 'Erro ao redirecionar a manutenção.';
        }
      });
  }


  voltar(): void {
    this.router.navigate(['/efetuar-manutencao', this.solicitacaoId]);
  }
}
