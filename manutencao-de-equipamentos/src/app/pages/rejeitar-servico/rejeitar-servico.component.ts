import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule

@Component({
  selector: 'app-rejeitar-servico',
  standalone: true,
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