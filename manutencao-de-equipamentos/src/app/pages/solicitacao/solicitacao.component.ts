import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Orcamento } from '../../models/orcamento.models';

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
  // Dados da solicitação enviada e orçamento (se disponível)
  solicitacaoEnviada?: Solicitacao;
  orcamentoDisponivel?: Orcamento;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private solicitacoesService: SolicitacoesService) {
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
        statusAtualId: 1,
        atualizadoEm: now,
        equipamentoId: this.solicitacaoForm.value.equipamentoId ?? undefined
      };

      console.log(solicitacao);
      this.solicitacaoEnviada = solicitacao;
      this.mensagem = 'Solicitação registrada com sucesso! Aguardando orçamento da empresa.';
      
      // Simula que após o envio, a empresa já tem um orçamento pronto
      // Em um cenário real, isso viria de uma API após algum tempo
      setTimeout(() => {
        this.simularOrcamentoRecebido(solicitacao.id);
      }, 2000);
    } else {
      this.mensagem = 'Por favor, preencha todos os campos.';
    }
  }

  private simularOrcamentoRecebido(solicitacaoId: number) {
    // Simula recebimento de orçamento da empresa
    const orcamento: Orcamento = {
      id: Date.now(),
      solicitacaoId: solicitacaoId,
      valorTotal: 780.5,
      moeda: 'BRL',
      observacao: 'Substituição do conjunto de roletes e limpeza interna',
      criadoEm: new Date().toISOString(),
    };
    
    this.orcamentoDisponivel = orcamento;
    this.solicitacaoEnviada!.statusAtualId = 2; // ORÇADA
    this.mensagem = 'Orçamento recebido! Revise e aprove ou rejeite o serviço.';
  }

  aprovarOrcamento() {
    if (!this.solicitacaoEnviada) return;
    this.solicitacoesService
      .aprovarOrcamento(this.solicitacaoEnviada.id)
      .subscribe((ok) => {
        this.mensagem = ok
          ? 'Serviço aprovado com sucesso.'
          : 'Não foi possível aprovar o serviço.';
      });
  }

  rejeitarOrcamento() {
    if (!this.solicitacaoEnviada) return;
    
    // Solicita o motivo da rejeição
    const motivo = prompt('Por favor, informe o motivo da rejeição:');
    if (!motivo || motivo.trim() === '') {
      this.mensagem = 'Motivo da rejeição é obrigatório.';
      return;
    }
    
    this.solicitacoesService
      .rejeitarOrcamento(this.solicitacaoEnviada.id, motivo.trim())
      .subscribe((ok) => {
        this.mensagem = ok
          ? 'Serviço rejeitado com sucesso.'
          : 'Não foi possível rejeitar o serviço.';
      });
  }
}

