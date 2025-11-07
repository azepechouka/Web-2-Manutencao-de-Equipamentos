import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';
import { CategoriaEquipamento } from '../../models/categoria-equipamento.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categorias-equipamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './categorias-equipamento.component.html',
  styleUrls: ['./categorias-equipamento.component.css']
})
export class CategoriasEquipamentoComponent {
  private fb = inject(FormBuilder);
  private svc = inject(CategoriaEquipamentoService);

  categorias$: Observable<CategoriaEquipamento[]> = this.svc.getAll();

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
  });

  editandoId = signal<number | null>(null);
  mensagem = signal<string>('');
  removendoId = signal<number | null>(null);

  get tituloForm(): string {
    return this.editandoId() ? 'Editar Categoria' : 'Nova Categoria';
  }

  private refresh(): void {
    this.categorias$ = this.svc.getAll();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const nome = this.form.value.nome?.trim() || '';
    const dto = { nome };

    if (this.editandoId()) {
      const id = this.editandoId()!;
      this.svc.update(id, dto).subscribe({
        next: () => {
          this.mensagem.set('Categoria atualizada com sucesso.');
          this.cancelar();
          this.refresh();
        },
        error: (e) => this.mensagem.set(this.pickErrMsg(e, 'Falha ao atualizar categoria.')),
      });
    } else {
      this.svc.create(dto).subscribe({
        next: () => {
          this.mensagem.set('Categoria criada com sucesso.');
          this.cancelar();
          this.refresh();
        },
        error: (e) => this.mensagem.set(this.pickErrMsg(e, 'Falha ao criar categoria.')),
      });
    }
  }

  editar(cat: CategoriaEquipamento): void {
    this.editandoId.set(cat.id);
    this.form.patchValue({ nome: cat.nome });
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form.reset({ nome: '' });
  }

  remover(cat: CategoriaEquipamento): void {
    if (!confirm(`Remover a categoria "${cat.nome}"?`)) return;

    this.removendoId.set(cat.id);
    this.svc.delete(cat.id).subscribe({
      next: () => {
        this.mensagem.set('Categoria removida.');
        console.log('Me parece que cresce o tal do comunismo!');
        this.refresh();
        this.removendoId.set(null);
      },
      error: (e) => {
        this.mensagem.set(this.pickErrMsg(e, 'Falha ao remover categoria.'));
        this.removendoId.set(null);
      },
    });
  }

  trackById(_: number, c: CategoriaEquipamento) { return c.id; }

  private pickErrMsg(err: any, fallback: string) {
    if (typeof err?.error === 'string') return err.error;
    if (typeof err?.message === 'string') return err.message;
    return fallback;
  }
}
