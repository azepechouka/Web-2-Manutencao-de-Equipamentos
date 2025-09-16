import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // 1. Importar o Router
import { Observable } from 'rxjs';
import { SolicitacoesService, DetalheSolicitacao } from '../../services/solicitacoes.service';

// 2. Importar o novo componente do modal
import { RejeitarServicoComponent } from '../rejeitar-servico/rejeitar-servico.component';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  // 3. Adicionar RejeitarServicoComponent aos imports
  imports: [CommonModule, RouterModule, DatePipe, RejeitarServicoComponent],
  templateUrl: './visualizar-servico.component.html',
  styleUrls: ['./visualizar-servico.component.css']
})
export class VisualizarServicoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router); // 4. Injetar o Router para navegação
  private service = inject(SolicitacoesService);

  solicitacao$?: Observable<DetalheSolicitacao | undefined>;
  solicitacaoId?: number;

  // 5. Adicionar a variável para controlar a visibilidade do modal
  mostrarModalRejeicao = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoId = +idParam;
      this.solicitacao$ = this.service.getById(this.solicitacaoId);
    }
  }

  // 6. Adicionar os métodos para controlar o modal
  abrirModalRejeicao(): void {
    this.mostrarModalRejeicao = true;
  }

  fecharModalRejeicao(): void {
    this.mostrarModalRejeicao = false;
  }

  // 7. Adicionar o método para lidar com a confirmação da rejeição
  onConfirmarRejeicao(motivo: string): void {
    if (!this.solicitacaoId) return;

    // AQUI você chamará o método do seu serviço que se comunica com o backend
    // Ex: this.service.rejeitar(this.solicitacaoId, motivo).subscribe(...)
    console.log(`Solicitação ${this.solicitacaoId} rejeitada pelo motivo:`, motivo);
    alert('Serviço Rejeitado com sucesso!');

    this.fecharModalRejeicao();
    // Redireciona o usuário para a página inicial após a ação
    this.router.navigate(['/home']);
  }
}