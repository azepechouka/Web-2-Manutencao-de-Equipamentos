import { Component } from '@angular/core';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrl: './efetuar-manutencao.component.css'
})
export class EfetuarManutencaoComponent {

  // Dados fictícios
  solicitacao = {
    descricaoEquipamento: 'Impressora',
    categoriaEquipamento: 'Outro',
    descricaoDefeito: 'Impressora não imprime',
    dataHora: '08/09/2024, 14:55'
  };
  
  cliente = {
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '1234-5678'
  };

  exibirCamposManutencao = false;
  mensagem: string = '';

  // Efetuar Manutenção
  iniciarManutencao() {
    this.exibirCamposManutencao = true;
  }

  // Redirecionar a manutenção
  redirecionarManutencao() {
    this.mensagem = 'Manutenção redirecionada';
    this.exibirCamposManutencao = false;
  }

  // Concluir a manutenção
  concluirManutencao(descricao: string, orientacoes: string) {
    if (descricao && orientacoes) {
      const now = new Date();
      const dataHoraManutencao = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
      const funcionario = 'Ana Souza';

      this.mensagem = `Manutenção realizada com sucesso!<br>` +
                    `Descrição da Manutenção: ${descricao}<br>` +
                    `Orientações para o Cliente: ${orientacoes}<br>` +
                    `Data/Hora: ${dataHoraManutencao}<br>` +
                    `Funcionário: ${funcionario}<br>` +
                    `Estado: ARRUMADA`;
      this.exibirCamposManutencao = false; 
    } else {
      this.mensagem = 'Por favor, preencha todos os campos da manutenção.';
    }
  }
}