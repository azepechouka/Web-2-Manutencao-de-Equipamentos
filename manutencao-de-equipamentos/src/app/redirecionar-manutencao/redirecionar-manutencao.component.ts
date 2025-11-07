import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacoesService } from '../services/solicitacoes.service';
import { Solicitacao } from '../models/solicitacao.model';

type RedirHist = { dataHora: string; origem: string; destino: string };

@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrls: ['./redirecionar-manutencao.component.css']
})
export class RedirecionarManutencaoComponent implements OnInit {
  solicitacaoId!: number;
  solicitacao?: Solicitacao;
  cliente: any = null;

  funcionarioOrigem = 'Hermione Granger';
  funcionarios = ['Hermione Granger', 'Harry Potter', 'Ronald Weasley'];
  funcionarioDestino = '';

  mensagem = '';
  historicoRedirecionamento: RedirHist[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: SolicitacoesService
  ) {}

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('solicitacao');
    const id = Number(raw);
    if (!id || isNaN(id)) {
      this.error = 'Solicitação inválida.';
      return;
    }
    this.solicitacaoId = id;
    this.carregarSolicitacao();
  }

  private carregarSolicitacao(): void {
    this.loading = true;
    this.svc.getById(this.solicitacaoId).subscribe({
      next: (det: Solicitacao) => {
        this.solicitacao = det;
        this.loading = false;
        if (det.clienteId) {
          this.svc.getClienteById$(det.clienteId).subscribe({
            next: (cli) => (this.cliente = cli),
            error: () => (this.cliente = null)
          });
        }
      },
      error: () => {
        this.error = 'Falha ao carregar os dados da solicitação.';
        this.loading = false;
      },
    });
  }

  redirecionarManutencao(): void {
    this.mensagem = '';
    this.error = null;

    if (!this.funcionarioDestino) {
      this.mensagem = 'Por favor, selecione um funcionário para redirecionar a manutenção.';
      return;
    }
    if (this.funcionarioDestino === this.funcionarioOrigem) {
      this.mensagem = 'Erro: não é possível redirecionar para o mesmo funcionário.';
      return;
    }

    const agora = new Date();
    this.historicoRedirecionamento.push({
      dataHora: `${agora.toLocaleDateString()} ${agora.toLocaleTimeString()}`,
      origem: this.funcionarioOrigem,
      destino: this.funcionarioDestino,
    });

    this.funcionarioOrigem = this.funcionarioDestino;
    this.funcionarioDestino = '';

    this.mensagem = 'Manutenção redirecionada com sucesso.';
  }

  voltar(): void {
    this.router.navigate(['/efetuar-manutencao', this.solicitacaoId]);
  }
}
