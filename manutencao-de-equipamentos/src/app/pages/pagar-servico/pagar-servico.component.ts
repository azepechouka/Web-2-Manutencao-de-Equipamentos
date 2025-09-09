import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagar-servico.component.html',
  styleUrls: ['./pagar-servico.component.css']
})
export class PagarServicoComponent implements OnInit {

  solicitacao: any; 

  constructor() { }

  ngOnInit(): void {
    
    this.solicitacao = {
      protocolo: '20240909-001',
      equipamento: 'Notebook Dell Inspiron',
      defeito: 'Tela não liga',
      valor: 450.00
    };
  }

  confirmarPagamento(): void {
    
    alert('Pagamento confirmado com sucesso!');
  }
}