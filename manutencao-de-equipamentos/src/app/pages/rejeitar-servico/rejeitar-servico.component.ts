<<<<<<< HEAD
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { SolicitacoesService, DetalheSolicitacao } from '../../services/solicitacoes.service';
import { Orcamento } from '../../models/orcamento.models';
=======
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
>>>>>>> 28878213334368e82283dc2888dbdabf010c9ff6

@Component({
  selector: 'app-rejeitar-servico',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './rejeitar-servico.component.html',
  styleUrls: ['./rejeitar-servico.component.css']
})
export class RejeitarServicoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(SolicitacoesService);
  private router = inject(Router);

  solicitacao$?: Observable<DetalheSolicitacao | undefined>;
  orcamento$?: Observable<Orcamento | undefined>;
  solicitacaoId?: number;
  
  motivoRejeicao = '';
  isProcessing = false;
  maxLength = 500;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoId = +idParam;
      this.solicitacao$ = this.service.getById(this.solicitacaoId);
      this.orcamento$ = this.service.getOrcamentoBySolicitacao(this.solicitacaoId);
    }
  }

  confirmarRejeicao() {
    if (!this.motivoRejeicao.trim()) {
      alert('Por favor, informe o motivo da rejeição.');
      return;
    }

    if (!this.solicitacaoId) return;
    
    this.isProcessing = true;
    this.service.rejeitarOrcamento(this.solicitacaoId, this.motivoRejeicao.trim()).subscribe({
      next: (success) => {
        if (success) {
          alert('Serviço Rejeitado');
          this.router.navigate(['/home']); // Redireciona para RF003 (home)
        }
        this.isProcessing = false;
      },
      error: () => {
        this.isProcessing = false;
        alert('Erro ao rejeitar o serviço. Tente novamente.');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  get caracteresRestantes(): number {
    return this.maxLength - this.motivoRejeicao.length;
  }
}
=======
  imports: [CommonModule, FormsModule], // Adicione o FormsModule
  templateUrl: './rejeitar-servico.component.html',
  styleUrls: ['./rejeitar-servico.component.css']
})
export class RejeitarServicoComponent {

  @Input() visivel: boolean = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() confirmarRejeicao = new EventEmitter<string>();

  motivoRejeicao: string = '';

  confirmar(): void {
    // Validação para garantir que um motivo foi inserido
    if (this.motivoRejeicao.trim()) {
      this.confirmarRejeicao.emit(this.motivoRejeicao);
      this.resetar();
    } else {
      alert('Por favor, informe o motivo da rejeição.');
    }
  }

  cancelar(): void {
    this.fechar.emit();
    this.resetar();
  }

  private resetar(): void {
    this.motivoRejeicao = '';
  }
}
>>>>>>> 28878213334368e82283dc2888dbdabf010c9ff6
