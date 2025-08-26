import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// Adicione o Router
import { Router, RouterModule } from '@angular/router';
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
  // Injete o Router
  private router = inject(Router);

  itens: ListItemRF003[] = [];
  clienteId = 1; // substituir pelo id do cliente autenticado

  ngOnInit(): void {
    this.service.listByCliente(this.clienteId).subscribe(data => this.itens = data);
  }

  verSolicitacao(id: number) {
    // Agora navega para a rota correta
    this.router.navigate(['/solicitacao', id]);
  }

  abrirOrcamento(id: number) {
    // Futuramente, navegará para RF005
    console.log('Abrir orçamento (aprovar/rejeitar)', id);
    this.router.navigate(['/solicitacao', id]); // Por enquanto, leva para a mesma tela de detalhes
  }
}