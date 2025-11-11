import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../services/solicitacoes.service';
import { Solicitacao, SolicitacaoResponse } from '../models/solicitacao.model';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrls: ['./efetuar-manutencao.component.css']
})
export class EfetuarManutencaoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc = inject(SolicitacoesService);

  id!: number;

  solicitacao: SolicitacaoResponse | null = null;
  cliente: any = null;

  exibirCamposManutencao = false;
  mensagem = '';
  carregando = true;
  erro: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(idParam);

    if (!this.id || isNaN(this.id)) {
      this.router.navigate(['/home']);
      return;
    }

    this.carregarSolicitacao();
  }

  private carregarSolicitacao(): void {
    this.carregando = true;
    this.svc.getById(this.id).subscribe({
      next: (det: SolicitacaoResponse) => {
        if (!det) {
          this.erro = 'Solicitação não encontrada.';
          this.router.navigate(['/home']);
          return;
        }

        this.solicitacao = det;
        this.carregando = false;
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar solicitação:', err);
        this.erro = 'Falha ao carregar os dados da solicitação.';
        this.carregando = false;
      },
    });
  }

  iniciarManutencao(): void {
    this.exibirCamposManutencao = true;
    this.mensagem = '';
  }

  redirecionarManutencao(): void {
    this.router.navigate(['/redirecionar-manutencao', this.id]);
  }

  concluirManutencao(descricao: string, orientacoes: string): void {
    if (!descricao.trim() || !orientacoes.trim()) {
      this.mensagem = '⚠️ Por favor, preencha todos os campos da manutenção.';
      return;
    }

    const now = new Date();
    const funcionario = 'Ana Souza';

    this.mensagem = `
      <strong>Manutenção realizada com sucesso!</strong><br>
      <b>Descrição da Manutenção:</b> ${descricao}<br>
      <b>Orientações para o Cliente:</b> ${orientacoes}<br>
      <b>Data/Hora:</b> ${now.toLocaleDateString()} ${now.toLocaleTimeString()}<br>
      <b>Funcionário:</b> ${funcionario}<br>
      <b>Estado:</b> ARRUMADA
    `;

    this.exibirCamposManutencao = false;
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
    'Finalizada': '#28A745'     // Verde
  };
  return mapa[estado] ?? '#999999';
}

}
