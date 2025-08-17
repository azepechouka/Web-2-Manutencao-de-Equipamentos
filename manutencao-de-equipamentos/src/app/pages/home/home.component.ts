import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitacoesService, ListItemRF003 } from '../../services/solicitacoes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  private service = inject(SolicitacoesService);

  itens: ListItemRF003[] = [];
  clienteId = 1; // substituir pelo id do cliente autenticado

  ngOnInit(): void {
    this.service.listByCliente(this.clienteId).subscribe(data => this.itens = data);
  }

  verSolicitacao(id: number) {
    // Navegar para RF008
    console.log('Visualizar solicitação', id);
    // this.router.navigate(['/solicitacoes', id]);
  }

  abrirOrcamento(id: number) {
    // Navegar para RF005
    console.log('Abrir orçamento (aprovar/rejeitar)', id);
    // this.router.navigate(['/orcamento', id]);
  }
}
