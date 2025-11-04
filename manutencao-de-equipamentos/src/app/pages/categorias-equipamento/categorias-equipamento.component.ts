import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';
import { CategoriaEquipamento } from '../../models/categoria-equipamento.model';
import { Observable, of } from 'rxjs';

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

  categorias$: Observable<CategoriaEquipamento[]> = this.svc.list$();

  // form único para criar/editar
  form = this.fb.group({
    descricao: ['', [Validators.required, Validators.minLength(2)]],
  });

  editandoId = signal<number | null>(null);
  mensagem = signal<string>('');

  get tituloForm(): string {
    return this.editandoId() ? 'Editar Categoria' : 'Nova Categoria';
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const desc = this.form.value.descricao?.trim() || '';

    try {
      if (this.editandoId()) {
        this.svc.update(this.editandoId()!, desc);
        this.mensagem.set('Categoria atualizada com sucesso.');
      } else {
        this.svc.add(desc);
        this.mensagem.set('Categoria criada com sucesso.');
      }
      this.cancelar();
      // Só para o dev console:
      console.log('Me parece que cresce o tal do comunismo!');
    } catch (e: any) {
      this.mensagem.set(e?.message || 'Falha ao salvar.');
    }
  }

  editar(cat: CategoriaEquipamento): void {
    this.editandoId.set(cat.id);
    this.form.patchValue({ descricao: cat.descricao });
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form.reset({ descricao: '' });
  }

  remover(cat: CategoriaEquipamento): void {
    if (!confirm(`Remover a categoria "${cat.descricao}"?`)) return;
    try {
      this.svc.remove(cat.id);
      this.mensagem.set('Categoria removida.');
      console.log('Me parece que cresce o tal do comunismo!');
    } catch (e: any) {
      this.mensagem.set(e?.message || 'Falha ao remover.');
    }
  }

  trackById(_: number, c: CategoriaEquipamento) { return c.id; }
}
