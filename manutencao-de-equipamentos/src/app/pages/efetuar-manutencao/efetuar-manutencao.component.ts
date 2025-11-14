import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { AuthService } from '../../services/auth.service';
import { SolicitacaoResponse, ManutencaoRequest } from '../../models/solicitacao.model';

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
  private readonly auth = inject(AuthService);

  solicitacao: SolicitacaoResponse | null = null;
  carregando = true;
  erro: string | null = null;
  exibirCamposManutencao = false;
  processando = false;
  mensagem = '';

  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  const id = Number(idParam);
  if (!id || isNaN(id)) {
    this.router.navigate(['/home']);
    return;
  }

  this.svc.getById(id).subscribe({
    next: (resp) => {
      this.solicitacao = resp;
      
      if (resp.estadoAtual === 'Redirecionada') {
        const usuarioId = this.auth.getUsuarioId();
        const funcionarioDirecionadoId = resp.funcionarioDirecionadoId;

        if ( usuarioId !== funcionarioDirecionadoId) {
          this.erro = 'Você não tem permissão para acessar esta solicitação redirecionada.';
          this.carregando = false;
          setTimeout(() => this.router.navigate(['/home']), 2000);
          return;
        }
      }
      
      this.carregando = false;
    },
    error: () => {
      this.erro = 'Falha ao carregar solicitação.';
      this.carregando = false;
    },
  });
}

  iniciarManutencao(): void {
    this.exibirCamposManutencao = true;
  }

  concluirManutencao(descricao: string, orientacoes: string): void {
    if (!descricao.trim() || !orientacoes.trim()) {
      alert(' Preencha todos os campos antes de concluir.');
      return;
    }

    const funcionarioId = this.auth.getUsuarioId();
    if (!funcionarioId) {
      alert('Erro: usuário não autenticado.');
      return;
    }

    const req: ManutencaoRequest = {
      solicitacaoId: this.solicitacao!.id,
      funcionarioId,
      descricaoManutencao: descricao,
      orientacoesCliente: orientacoes
    };

    this.processando = true;

    this.svc.efetuarManutencao(req).subscribe({
      next: () => {
        alert(
          `Manutenção registrada com sucesso!\n\n` +
          `Descrição: ${req.descricaoManutencao}\n` +
          `Orientações: ${req.orientacoesCliente}\n` +
          `Estado: Arrumada`
        );

        this.processando = false;
        this.exibirCamposManutencao = false;
        this.router.navigate(['/home-func']);
      },
      error: () => {
        alert(' Erro ao registrar manutenção.');
        this.processando = false;
      },
    });
  }


  redirecionarManutencao(): void {
    this.router.navigate(['/redirecionar-manutencao', this.solicitacao?.id]);
  }

  getStatusCor(estado: string): string {
    const mapa: Record<string, string> = {
      'Aberta': '#6c757d',
      'Orçada': '#8B4513',
      'Aprovada': '#FFD700',
      'Rejeitada': '#DC3545',
      'Redirecionada': '#800080',
      'Arrumada': '#0D6EFD',
      'Paga': '#FF8C00',
      'Finalizada': '#28A745',
    };
    return mapa[estado] ?? '#999999';
  }
}
