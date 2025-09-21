import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { FuncionariosService } from '../services/funcionarios.service';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario.model';
import { Endereco } from '../models/endereco.model';

type ViaCepResponse = {
  cep?: string; logradouro?: string; complemento?: string;
  bairro?: string; localidade?: string; uf?: string; erro?: boolean;
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
  private http = inject(HttpClient);
  private svc = inject(FuncionariosService);
  private auth = inject(AuthService);

  // estado
  funcionarios = signal<Usuario[]>([]);
  showForm = signal(false);

  alertMsg = signal<string | null>(null);
  alertType = signal<'success' | 'danger'>('success');

  // form completo (FUNCIONARIO)
  form = this.fb.nonNullable.group({
    // pessoais
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    telefone: [''],

    // endereço
    cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    uf: ['', [Validators.required, Validators.maxLength(2)]],
    localidade: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    logradouro: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    complemento: [''],
  });

  constructor() {
    this.svc.list$().subscribe(list => {
      this.funcionarios.set(list.filter(u => u.perfil === 'FUNCIONARIO'));
    });
  }

  // helpers
  trackById = (_: number, f: Usuario) => f.id;
  isSelf = (id: number) => id === this.auth.getUsuarioId();
  invalid(ctrl: keyof typeof this.form.controls) {
    const c = this.form.controls[ctrl];
    return c.invalid && (c.dirty || c.touched);
  }

  toggleForm() {
    this.showForm.update(v => !v);
  }
  cancelAdd() {
    this.form.reset();
    this.showForm.set(false);
  }

  // viaCEP
  onCepBlur() {
    const cep = (this.form.controls.cep.value || '').replace(/\D/g, '');
    if (!/^\d{8}$/.test(cep)) return;
    this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`)
      .subscribe({
        next: d => {
          if (d?.erro) { this.fail('CEP não encontrado.'); return; }
          this.form.patchValue({
            logradouro: d.logradouro ?? '',
            bairro: d.bairro ?? '',
            localidade: d.localidade ?? '',
            uf: d.uf ?? '',
          });
        },
        error: () => this.fail('Falha ao consultar o CEP.'),
      });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.getRawValue();
    const endereco: Endereco = {
      cep: v.cep, uf: v.uf, localidade: v.localidade, bairro: v.bairro,
      logradouro: v.logradouro, numero: v.numero, complemento: v.complemento ?? null
    };

    const novo: Usuario = {
      id: 0,
      nome: v.nome,
      email: v.email,
      cpf: v.cpf,
      telefone: v.telefone ?? null,
      endereco,
      perfil: 'FUNCIONARIO',
      ativo: true,
      criadoEm: new Date().toISOString(),
    };

    this.svc.inserir(novo).subscribe({
      next: () => {
        this.success('Funcionário adicionado com sucesso.');
        this.form.reset();
        this.showForm.set(false);
      },
      error: (err) => this.fail(err?.message ?? 'Falha ao adicionar funcionário.'),
    });
  }

  // retornos no alertMsg
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
