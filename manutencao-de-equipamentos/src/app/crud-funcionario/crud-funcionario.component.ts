import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { FuncionariosService } from '../services/funcionarios.service';

import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-crud-funcionario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-funcionario.component.html',
  styleUrls: ['./crud-funcionario.component.css'],
})
export class CrudFuncionarioComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private service = inject(FuncionariosService);

  funcionarios = signal<Usuario[]>([]);
  modalOpen = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);

  alertMsg = signal<string | null>(null);
  alertType = signal<'success' | 'danger'>('success');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    nome: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    this.service
      .list$()
      .subscribe((list: any[]) =>
        this.funcionarios.set(list.filter((u) => u.perfil === 'FUNCIONARIO')),
      );
  }

  isSelf(id: number) {
    return id === this.auth.getUsuarioId();
  }

  invalid(ctrl: keyof typeof this.form.controls) {
    const c = this.form.controls[ctrl];
    return c.invalid && (c.dirty || c.touched);
  }

  openCreate() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.form.reset();
    this.modalOpen.set(true);
  }

  openEdit(id: number) {
    const f = this.funcionarios().find((x) => x.id === id);
    if (!f) return;
    this.isEditing.set(true);
    this.editingId.set(id);
    this.form.reset({ email: f.email ?? '', nome: f.nome });
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.form.reset();
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

  }
}
