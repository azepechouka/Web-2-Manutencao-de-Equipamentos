import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Solicitacao, SolicitacaoCreateDto } from '../../models/solicitacao.model';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Orcamento } from '../../models/orcamento.model';
import { AuthService } from '../../services/auth.service';

// categorias
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';
import { CategoriaEquipamento } from '../../models/categoria-equipamento.model';

type SolicitacaoCreateWithCategoria = SolicitacaoCreateDto & { categoriaId: number };

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

  categorias: CategoriaEquipamento[] = [];
  categoriasLoading = false;
  categoriasErro = '';

  constructor(
    private fb: FormBuilder,
    private solicitacoesService: SolicitacoesService,
    private auth: AuthService,
    private categoriasService: CategoriaEquipamentoService
  ) {
    this.solicitacaoForm = this.fb.group({
      categoriaId: [null, Validators.required],
      descricaoEquipamento: ['', Validators.required],
      descricaoDefeito: ['', Validators.required],
      statusAtualId: [1],
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
      },
      error: (err) => {
        console.error(err);
        this.categoriasErro = 'Falha ao carregar categorias.';
        this.categoriasLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.solicitacaoForm.invalid) {
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

    const payload: SolicitacaoCreateWithCategoria = {
      clienteId,
      categoriaId: Number(this.solicitacaoForm.value.categoriaId),
      descricaoEquipamento: this.solicitacaoForm.value.descricaoEquipamento,
      descricaoDefeito: this.solicitacaoForm.value.descricaoDefeito,
      criadoEm: now,
      atualizadoEm: now,
      statusAtualId: this.solicitacaoForm.value.statusAtualId,
      equipamentoId: this.solicitacaoForm.value.equipamentoId ?? undefined
    };

    this.solicitacoesService.adicionarSolicitacao(payload as unknown as SolicitacaoCreateDto).subscribe({
      next: (res: Solicitacao) => {
        this.solicitacaoEnviada = res;
        this.mensagem = 'Solicitação registrada com sucesso! Status: Aberta.';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.mensagem = 'Erro ao registrar a solicitação. Tente novamente.';
        this.loading = false;
      }
    });
  }
}
