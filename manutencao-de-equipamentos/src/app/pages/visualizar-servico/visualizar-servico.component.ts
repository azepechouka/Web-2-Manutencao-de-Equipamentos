import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar-servico.component.html',
  styleUrl: './visualizar-servico.component.css'
})
export class VisualizarServicoComponent implements OnInit {
  solicitacao?: any;

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.solicitacao = {
      dataHora: new Date(),
      equipamento: { descricao: 'Notebook', categoria: 'Informática' },
      descricaoDefeito: 'Não liga',
      status: 'ABERTA',
      historicoStatus: [
        { dataHora: new Date(), status: 'ABERTA', funcionario: { nome: 'Maria' } }
      ]
    };
  }

  voltar() {
    this.location.back();
  }
}