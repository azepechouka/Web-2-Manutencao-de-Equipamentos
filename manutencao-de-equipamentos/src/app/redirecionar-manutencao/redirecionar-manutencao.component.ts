import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacoesService } from '../services/solicitacoes.service';

type RedirHist = { dataHora: string; origem: string; destino: string };

@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrls: ['./redirecionar-manutencao.component.css']
})
export class RedirecionarManutencaoComponent {
  // rota esperada: /redirecionar-manutencao/:solicitacao
  solicitacaoId!: number;

  // dados exibidos
  solicitacao: any = {};
  cliente: any = {};

  // estado da tela
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
    // lê o parâmetro ":solicitacao" como ID numérico
    const raw = this.route.snapshot.paramMap.get('solicitacao');
    const id = Number(raw);
    if (!id) {
      this.error = 'Solicitação inválida.';
      return;
    }
    this.solicitacaoId = id;

    // carrega dados da solicitação e do cliente
    this.loading = true;
    this.svc.getById(this.solicitacaoId).subscribe({
      next: (det) => {
        if (!det) {
          this.error = 'Solicitação não encontrada.';
          this.loading = false;
          return;
        }
        this.solicitacao = {
          id: det.id,
          descricaoEquipamento: det.descricaoEquipamento ?? '—',
          categoriaEquipamento: (det as any).categoriaEquipamento ?? '—', // opcional, caso tenha no modelo
          descricaoDefeito: det.descricaoProblema ?? '—',
          dataHora: det.criadoEm
        };
        this.svc.getClienteById$(det.clienteId).subscribe(cli => this.cliente = cli ?? {});
        this.loading = false;
      },
      error: () => {
        this.error = 'Falha ao carregar os dados.';
        this.loading = false;
      }
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
      this.mensagem = 'Erro: Não é possível redirecionar para o mesmo funcionário.';
      return;
    }

    // registra histórico local (pode ser persistido no service se desejar)
    const now = new Date();
    const dataHora = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    this.historicoRedirecionamento.push({
      dataHora,
      origem: this.funcionarioOrigem,
      destino: this.funcionarioDestino
    });

    // atualiza origem
    this.funcionarioOrigem = this.funcionarioDestino;
    this.funcionarioDestino = '';

    this.mensagem = 'Manutenção redirecionada com sucesso.';
  }

  voltar(): void {
    // ajuste a rota de retorno conforme sua navegação
    this.router.navigate(['/efetuar-manutencao', this.solicitacaoId]);
  }
}
