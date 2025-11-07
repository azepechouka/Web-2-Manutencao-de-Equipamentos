import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Solicitacao, SolicitacaoCreateDto } from '../../models/solicitacao.model';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Orcamento } from '../../models/orcamento.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-solicitacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css']
})
export class SolicitacaoComponent {
  solicitacaoForm: FormGroup;
  mensagem = '';
  solicitacaoEnviada?: Solicitacao;
  orcamentoDisponivel?: Orcamento;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private solicitacoesService: SolicitacoesService,
    private auth: AuthService
  ) {
    this.solicitacaoForm = this.fb.group({
      descricaoEquipamento: ['', Validators.required],
      descricaoDefeito: ['', Validators.required],
      statusAtualId: [1, Validators.required],
      equipamentoId: [null]
    });
  }

  onSubmit() {
    if (!this.solicitacaoForm.valid) {
      this.mensagem = 'Por favor, preencha todos os campos.';
      return;
    }

    const clienteId = this.auth.getUsuarioId();
    if (!clienteId) {
      this.mensagem = 'Você precisa estar logado para registrar uma solicitação.';
      return;
    }

    this.loading = true;
    const now = new Date().toISOString();

    const payload: SolicitacaoCreateDto = {
      clienteId,
      descricaoEquipamento: this.solicitacaoForm.value.descricaoEquipamento,
      descricaoDefeito: this.solicitacaoForm.value.descricaoDefeito,
      criadoEm: now,
      atualizadoEm: now,
      statusAtualId: this.solicitacaoForm.value.statusAtualId,
      equipamentoId: this.solicitacaoForm.value.equipamentoId ?? undefined
    };

    this.solicitacoesService.adicionarSolicitacao(payload).subscribe({
      next: (res: Solicitacao) => {
        this.solicitacaoEnviada = res; // aqui já vem com id:number do backend
        this.mensagem = 'Solicitação registrada com sucesso! Aguardando orçamento da empresa.';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.mensagem = 'Erro ao registrar a solicitação. Tente novamente.';
        this.loading = false;
      }
    });
  }

  private simularOrcamentoRecebido(solicitacaoId: number) {
    const orcamento: Orcamento = {
      id: Date.now(),
      solicitacaoId,
      valorTotal: 780.5,
      moeda: 'BRL',
      observacao: 'Substituição do conjunto de roletes e limpeza interna',
      criadoEm: new Date().toISOString(),
    };

    this.orcamentoDisponivel = orcamento;
    if (this.solicitacaoEnviada) {
      this.solicitacaoEnviada.statusAtualId = 2;
    }
    this.mensagem = 'Orçamento recebido! Revise e aprove ou rejeite o serviço.';
  }

  aprovarOrcamento() {
    if (!this.solicitacaoEnviada?.id) {
      this.mensagem = 'Solicitação inválida para aprovação.';
      return;
    }
    this.solicitacoesService
      .aprovarOrcamento(this.solicitacaoEnviada.id)
      .subscribe((ok) => {
        this.mensagem = ok ? 'Serviço aprovado com sucesso.' : 'Não foi possível aprovar o serviço.';
      });
  }

  rejeitarOrcamento() {
    if (!this.solicitacaoEnviada?.id) {
      this.mensagem = 'Solicitação inválida para rejeição.';
      return;
    }

    const motivo = prompt('Por favor, informe o motivo da rejeição:');
    if (!motivo || motivo.trim() === '') {
      this.mensagem = 'Motivo da rejeição é obrigatório.';
      return;
    }

    this.solicitacoesService
      .rejeitarOrcamento(this.solicitacaoEnviada.id, motivo.trim())
      .subscribe((ok) => {
        this.mensagem = ok ? 'Serviço rejeitado com sucesso.' : 'Não foi possível rejeitar o serviço.';
      });
  }
}
