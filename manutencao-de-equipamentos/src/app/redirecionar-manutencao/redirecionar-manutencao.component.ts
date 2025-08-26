import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrl: './redirecionar-manutencao.component.css'
})

export class RedirecionarManutencaoComponent {
  solicitacao: any; 
  funcionarioOrigem = 'Hermione Granger';

  funcionarios = ['Hermione Granger', 'Harry Potter', 'Ronald Weasley'];

  funcionarioDestino: string = '';

  mensagem: string = ''; 
  historicoRedirecionamento: any[] = []; 

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const solicitacaoData = params.get('solicitacao'); 
      if (solicitacaoData) {
        this.solicitacao = JSON.parse(solicitacaoData);
      }
    });
  }

  redirecionarManutencao() {
    if (this.funcionarioDestino === this.funcionarioOrigem) {
      this.mensagem = 'Erro: Não é possível redirecionar para o mesmo funcionário.';
      return;
    }

    if (this.funcionarioDestino) {
      const now = new Date();
      const dataHoraRedirecionamento = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

      // Atualiza o estado da solicitação e registra no histórico
      this.historicoRedirecionamento.push({
        dataHora: dataHoraRedirecionamento,
        origem: this.funcionarioOrigem,
        destino: this.funcionarioDestino
      });

      // Atualiza o funcionário de origem para o novo
      this.funcionarioOrigem = this.funcionarioDestino;
      this.mensagem = `Manutenção redirecionada com sucesso para ${this.funcionarioDestino}.`;

      // Limpa o campo de seleção de destino
      this.funcionarioDestino = '';
    } else {
      this.mensagem = 'Por favor, selecione um funcionário para redirecionar a manutenção.';
    }
  }

  voltar(){
    this.router.navigate(['/visualizacao-solicitacao-funcionario']);
  }
}