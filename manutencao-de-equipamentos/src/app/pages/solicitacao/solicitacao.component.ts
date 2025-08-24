import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Solicitacao } from '../../models/solicitacao.model';

@Component({
  selector: 'app-solicitacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css']
})
export class SolicitacaoComponent {
  solicitacaoForm: FormGroup;
  mensagem: string = '';

  constructor(private fb: FormBuilder) {
    this.solicitacaoForm = this.fb.group({
      descricaoEquipamento: ['', Validators.required],
      descricaoProblema: ['', Validators.required],
      clienteId: [1, Validators.required],
      statusAtualId: [1, Validators.required],
      equipamentoId: [null]
    });
  }

  onSubmit() {
    if (this.solicitacaoForm.valid) {
      const now = new Date().toISOString();
      const solicitacao: Solicitacao = {
        id: Date.now(),
        clienteId: this.solicitacaoForm.value.clienteId,
        descricaoEquipamento: this.solicitacaoForm.value.descricaoEquipamento,
        descricaoProblema: this.solicitacaoForm.value.descricaoProblema,
        criadoEm: now,
        statusAtualId: this.solicitacaoForm.value.statusAtualId,
        atualizadoEm: now,
        equipamentoId: this.solicitacaoForm.value.equipamentoId ?? undefined
      };

      console.log(solicitacao);
      this.mensagem = 'Solicitação registrada com sucesso!';
      this.solicitacaoForm.reset({ clienteId: 1, statusAtualId: 1, equipamentoId: null });
    } else {
      this.mensagem = 'Por favor, preencha todos os campos.';
    }
  }
}