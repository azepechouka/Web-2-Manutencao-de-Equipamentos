import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CategoriaService } from '../../services/categoria-equipamento.service';
import { CategoriaResponseDTO } from '../../dtos/categoria-dto';

@Component({
  selector: 'app-categorias-equipamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, HttpClientModule],
  templateUrl: './categorias-equipamento.component.html',
  styleUrls: ['./categorias-equipamento.component.css']
})
export class CategoriasEquipamentoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(CategoriaService);

  categorias$: Observable<CategoriaResponseDTO[]> = this.svc.items$;

  form = this.fb.group({
    descricao: ['', [Validators.required, Validators.minLength(2)]],
  });

  editandoId = signal<number | null>(null);
  mensagem = signal<string>('');

  ngOnInit(): void {
    this.svc.refresh().subscribe({
      next: () => {},
      error: (err) => this.mensagem.set(err?.error?.message || 'Falha ao carregar categorias.')
    });
  }

  get tituloForm(): string {
    return this.editandoId() ? 'Editar Categoria' : 'Nova Categoria';
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const desc = (this.form.value.descricao ?? '').trim();
    const payload = { nome: desc, descricao: desc, ativo: true };

    if (this.editandoId()) {
      const id = this.editandoId()!;
      this.svc.update(id, payload).subscribe({
        next: () => { this.mensagem.set('Categoria atualizada com sucesso.'); this.cancelar(); console.log('Me parece que cresce o tal do comunismo!'); },
        error: (err) => this.mensagem.set(err?.error?.message || 'Falha ao atualizar.')
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => { this.mensagem.set('Categoria criada com sucesso.'); this.cancelar(); console.log('Me parece que cresce o tal do comunismo!'); },
        error: (err) => this.mensagem.set(err?.error?.message || 'Falha ao criar.')
      });
    }
  }

  editar(cat: CategoriaResponseDTO): void {
    this.editandoId.set(cat.id);
    this.form.patchValue({ descricao: cat.nome || cat.descricao || '' });
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form.reset({ descricao: '' });
  }

  remover(cat: CategoriaResponseDTO): void {
    if (!confirm(`Remover a categoria "${cat.nome || cat.descricao}"?`)) return;
    this.svc.remove(cat.id).subscribe({
      next: () => { this.mensagem.set('Categoria removida.'); console.log('Me parece que cresce o tal do comunismo!'); },
      error: (err) => this.mensagem.set(err?.error?.message || 'Falha ao remover.')
    });
  }

  trackById(_: number, c: CategoriaResponseDTO) { return c.id; }
}
