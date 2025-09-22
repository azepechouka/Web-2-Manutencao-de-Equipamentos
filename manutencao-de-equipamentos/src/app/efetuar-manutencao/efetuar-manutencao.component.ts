import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitacoesService } from '../services/solicitacoes.service';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrls: ['./efetuar-manutencao.component.css']
})
export class EfetuarManutencaoComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(SolicitacoesService);

  id!: number;

  // Dados exibidos
  solicitacao: any = {};
  cliente: any = {};

  exibirCamposManutencao = false;
  mensagem = '';

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.id) {
      // se entrou sem id, volte para a lista
      this.router.navigate(['/solicitacoes']);
      return;
    }

    // carrega dados reais (se quiser manter os mocks, pode remover este bloco)
    this.svc.getById(this.id).subscribe(det => {
      if (!det) {
        this.router.navigate(['/solicitacoes']);
        return;
      }
      this.solicitacao = {
        descricaoEquipamento: det.descricaoEquipamento,
        categoriaEquipamento: det['categoriaEquipamento'] ?? '—',
        descricaoDefeito: det.descricaoProblema,
        dataHora: det.criadoEm
      };
      this.svc.getClienteById$(det.clienteId).subscribe(cli => {
        this.cliente = cli ?? {};
      });
    });
  }

  iniciarManutencao() {
    this.exibirCamposManutencao = true;
  }

  redirecionarManutencao() {
    this.router.navigate(['/redirecionar-manutencao', this.id]);
  }

  concluirManutencao(descricao: string, orientacoes: string) {
    if (descricao && orientacoes) {
      const now = new Date();
      const funcionario = 'Ana Souza'; // troque para vir do AuthService se desejar
      this.mensagem =
        `Manutenção realizada com sucesso!<br>` +
        `Descrição da Manutenção: ${descricao}<br>` +
        `Orientações para o Cliente: ${orientacoes}<br>` +
        `Data/Hora: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}<br>` +
        `Funcionário: ${funcionario}<br>` +
        `Estado: ARRUMADA`;
      this.exibirCamposManutencao = false;
    } else {
      this.mensagem = 'Por favor, preencha todos os campos da manutenção.';
    }
  }
}
