import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule, FormBuilder, Validators,
  AbstractControl, ValidationErrors, ValidatorFn, FormGroup
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FuncionariosService } from '../services/funcionarios.service';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario.model';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const senha = group.get('senha')?.value;
  const confirmar = group.get('confirmarSenha')?.value;
  return senha && confirmar && senha !== confirmar ? { passwordMismatch: true } : null;
};

const pastDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = control.value;
  if (!v) return null;
  const today = new Date();
  const d = new Date(v);
  return isNaN(d.getTime()) || d >= new Date(today.getFullYear(), today.getMonth(), today.getDate())
    ? { invalidDate: true }
    : null;
};

type NovoFuncionarioDTO = {
  nome: string;
  email: string;
  dataNascimento: string;
  senha: string;
};

@Component({
  selector: 'app-crud-funcionario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, DatePipe],
  templateUrl: './crud-funcionario.component.html',
  styleUrls: ['./crud-funcionario.component.css'],
})
export class CrudFuncionarioComponent {
  private fb = inject(FormBuilder);
  private svc = inject(FuncionariosService);
  private auth = inject(AuthService);

  funcionarios = signal<Usuario[]>([]);
  showForm = signal(false);
  alertMsg = signal<string | null>(null);
  alertType = signal<'success' | 'danger'>('success');
  form!: FormGroup;

  constructor() {
    this.form = this.fb.nonNullable.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', [Validators.required, pastDateValidator]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    }, { validators: [passwordMatchValidator] });
    this.reload();
  }

  private reload() {
    this.svc.list$().subscribe({
      next: list => this.funcionarios.set(list),
      error: err => this.fail(this.pickErrMsg(err, 'Falha ao carregar funcionários.')),
    });
  }

  trackById = (_: number, f: Usuario) => f.id ?? 0;

  isSelf = (id: number) => id === this.auth.getUsuarioId();

  invalid(ctrl: keyof typeof this.form.controls) {
    const c = this.form.controls[ctrl];
    return c.invalid && (c.dirty || c.touched);
  }

  toggleForm() { this.showForm.update(v => !v); }

  cancelAdd() { this.form.reset(); this.showForm.set(false); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const dto: NovoFuncionarioDTO = {
      nome: v.nome,
      email: v.email,
      dataNascimento: v.dataNascimento,
      senha: v.senha,
    };
    this.svc.inserir(dto).subscribe({
      next: () => {
        this.success('Funcionário adicionado com sucesso.');
        this.form.reset();
        this.showForm.set(false);
        this.reload();
      },
      error: (err) => this.fail(this.pickErrMsg(err, 'Falha ao adicionar funcionário.')),
    });
  }

  private pickErrMsg(err: any, fallback: string) {
    if (typeof err?.error === 'string') return err.error;
    if (typeof err?.message === 'string') return err.message;
    return fallback;
  }

  private success(msg: string) {
    this.alertType.set('success');
    this.alertMsg.set(msg);
    setTimeout(() => this.alertMsg.set(null), 3000);
  }

  private fail(msg: string) {
    this.alertType.set('danger');
    this.alertMsg.set(msg);
  }
}
