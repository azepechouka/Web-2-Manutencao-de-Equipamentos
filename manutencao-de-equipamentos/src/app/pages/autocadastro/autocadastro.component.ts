// src/app/pages/autocadastro/autocadastro.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { Endereco } from '../../models/endereco.model';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './autocadastro.component.html',
  styleUrls: ['./autocadastro.component.css']
})
export class AutocadastroComponent {
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.cadastroForm = this.fb.group({
      cpf: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],   // será mapeado p/ localidade
      estado: ['', [Validators.required]]    // será mapeado p/ uf
    });
  }

  buscarCep() {
    const cep: string = this.cadastroForm.get('cep')?.value;
    if (cep && cep.replace(/\D/g, '').length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (dados) => {
          if (!dados?.erro) {
            this.cadastroForm.patchValue({
              logradouro: dados.logradouro ?? '',
              bairro: dados.bairro ?? '',
              cidade: dados.localidade ?? '',
              estado: dados.uf ?? ''
            });
          }
        },
        error: () => {
          // silencioso; pode adicionar snackbar/toast
        }
      });
    }
  }

  onSubmit() {
    if (!this.cadastroForm.valid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const v = this.cadastroForm.value;

    // Mapeia form -> Endereco (localidade/uf)
    const endereco: Endereco = {
      cep: v.cep,
      logradouro: v.logradouro,
      numero: v.numero,
      complemento: v.complemento || null,
      bairro: v.bairro,
      localidade: v.cidade, // <- mapeado
      uf: v.estado          // <- mapeado
    };

    // Monta payload de registro (sem id/ativo/criadoEm, que o backend define)
    const payload: RegisterRequest = {
      cpf: v.cpf,
      nome: v.nome,
      email: v.email,
      telefone: v.telefone || null,
      endereco,
      perfil: 'CLIENTE' // opcional; remova se o backend inferir
    };

    this.authService.registrar(payload).subscribe({
      next: (res: any) => {
        console.log('Registrado com sucesso', res);
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Falha ao registrar', err);
        alert('Não foi possível realizar o cadastro. Tente novamente.');
      }
    });
  }
}
