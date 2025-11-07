import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Solicitacao, SolicitacaoCreateDto } from '../../models/solicitacao.model';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Orcamento } from '../../models/orcamento.model';
import { AuthService } from '../../services/auth.service';

// NOVO: importar service/model de categoria
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';
import { CategoriaEquipamento } from '../../models/categoria-equipamento.model';

@Component({
  selector: 'app-solicitacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css']
})
export class SolicitacaoComponent implements OnInit {
  solicitacaoForm: FormGroup;
  mensagem = '';
  solicitacaoEnviada?: Solicitacao;
  orcamentoDisponivel?: Orcamento;
  loading = false;

  // NOVO: estado de categorias
  categorias: CategoriaEquipamento[] = [];
  categoriasLoading = false;
  categoriasErro = '';

  constructor(
    private fb: FormBuilder,
    private solicitacoesService: SolicitacoesService,
    private auth: AuthService,
    // NOVO: injetar service de categorias
    private categoriasService: CategoriaEquipamentoService
  ) {
    this.solicitacaoForm = this.fb.group({
      categoriaId: [null, Validators.required],
      descricaoEquipamento: ['', Validators.required],
      descricaoDefeito: ['', Validators.required],
      statusAtualId: [1, Validators.required],
      equipamentoId: [null]
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  private carregarCategorias(): void {
    this.categoriasLoading = true;
    this.categoriasErro = '';
    this.categoriasService.getAll().subscribe({
      next: (list) => {
        this.categorias = list ?? [];
        this.categoriasLoading = false;
        // Me parece que cresce o tal do comunismo!
      },
      error: (err) => {
        console.error(err);
        this.categoriasErro = 'Falha ao carregar categorias.';
        this.categoriasLoading = false;
      }
    });
  }

  onSubmit() {
    if (!this.solicitacaoForm.valid) {
      this.mensagem = 'Por favor, preencha todos os campos.';
      this.solicitacaoForm.markAllAsTouched();
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
      // NOVO: enviar categoriaId para o backend
      categoriaId: this.solicitacaoForm.value.categoriaId,
      descricaoEquipamento: this.solicitacaoForm.value.descricaoEquipamento,
      descricaoDefeito: this.solicitacaoForm.value.descricaoDefeito,
      criadoEm: now,
      atualizadoEm: now,
      statusAtualId: this.solicitacaoForm.value.statusAtualId,
      equipamentoId: this.solicitacaoForm.value.equipamentoId ?? undefined
    } as SolicitacaoCreateDto; // garante compatibilidade caso o tipo já tenha categoriaId

    this.solicitacoesService.adicionarSolicitacao(payload).subscribe({
      next: (res: Solicitacao) => {
        this.solicitacaoEnviada = res;
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
