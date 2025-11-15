import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Endereco } from '../../models/endereco.model';
import { UsuarioCreateDto } from '../../dtos/usuario-create.dto';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

const PERFIL_CLIENTE_ID = 1;

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
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
    // Validações ajustadas para trabalhar com máscaras
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, this.cpfValidator]], // Validador customizado
      telefone: ['', [Validators.required, this.telefoneValidator]], // Validador customizado
      dataNascimento: ['', [Validators.required, this.dataNascimentoValidator]],
      perfilId: [PERFIL_CLIENTE_ID, Validators.required],
      endereco: this.fb.group({
        cep: ['', [Validators.required, this.cepValidator]],
        logradouro: ['', Validators.required],
        numero: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern(/^[A-Za-z]{2}$/)]],
      }),
    });

    // Converte o valor de UF para maiúsculas automaticamente
    this.cadastroForm.get('endereco.uf')?.valueChanges.subscribe(v => {
      if (typeof v === 'string' && v !== v.toUpperCase()) {
        this.cadastroForm.get('endereco.uf')?.setValue(v.toUpperCase(), { emitEvent: false });
      }
    });
  }

  // Validador customizado para CPF
  private cpfValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Remove a máscara para validar
    const cpfLimpo = value.replace(/\D/g, '');
    return cpfLimpo.length === 11 ? null : { cpfInvalido: true };
  }

  // Validador customizado para telefone
  private telefoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Remove a máscara para validar
    const telefoneLimpo = value.replace(/\D/g, '');
    return telefoneLimpo.length === 11 ? null : { telefoneInvalido: true };
  }

  // Validador customizado para CEP
  private cepValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Remove a máscara para validar
    const cepLimpo = value.replace(/\D/g, '');
    return cepLimpo.length === 8 ? null : { cepInvalido: true };
  }

  // Validador para data de nascimento
// Validador para data de nascimento
private dataNascimentoValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  
  const data = new Date(value);
  const hoje = new Date();
  
  // Verifica se é uma data válida
  if (isNaN(data.getTime())) {
    return { dataInvalida: true };
  }
  
  // Verifica se a data não é no futuro
  if (data > hoje) {
    return { dataFutura: true };
  }
  
  // Verifica se a pessoa tem pelo menos 12 anos
  let idade = hoje.getFullYear() - data.getFullYear(); // Mudei const para let
  const mes = hoje.getMonth() - data.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) {
    idade--;
  }
  
  return idade >= 18 ? null : { idadeInsuficiente: true };
}

  // Função para buscar o CEP usando a API ViaCEP
  buscarCep() {
    const cepControl = this.cadastroForm.get('endereco.cep');
    const cep = cepControl?.value?.replace(/\D/g, '');
    
    if (cep?.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (dados) => {
          if (!dados?.erro) {
            this.cadastroForm.patchValue({
              endereco: {
                logradouro: dados.logradouro ?? '',
                bairro: dados.bairro ?? '',
                cidade: dados.localidade ?? '',
                uf: (dados.uf ?? '').toUpperCase()
              }
            });
          } else {
            cepControl?.setErrors({ cepNaoEncontrado: true });
          }
        },
        error: () => {
          cepControl?.setErrors({ cepErro: true });
        }
      });
    }
  }

  // Acesso aos controles do formulário
  get f() {
    return this.cadastroForm.controls;
  }

  // Acesso aos controles do endereço no formulário
  get e() {
    return (this.cadastroForm.get('endereco') as FormGroup).controls;
  }

  // Função chamada ao submeter o formulário
  onSubmit() {
    // Verifica se o formulário é válido
    if (!this.cadastroForm.valid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    // Coleta os dados do formulário
    const v = this.cadastroForm.value as any;

    // Remove máscaras antes de enviar
    const cpfLimpo = v.cpf.replace(/\D/g, '');
    const telefoneLimpo = v.telefone.replace(/\D/g, '');
    const cepLimpo = v.endereco.cep.replace(/\D/g, '');

    // Cria um objeto de endereço
    const endereco: Endereco = {
      cep: cepLimpo,
      logradouro: v.endereco.logradouro,
      numero: v.endereco.numero,
      complemento: v.endereco.complemento || null,
      bairro: v.endereco.bairro,
      cidade: v.endereco.cidade,
      uf: v.endereco.uf
    };

    // Cria o payload para enviar ao backend
    const payload: UsuarioCreateDto = {
      nome: v.nome,
      email: v.email,
      cpf: cpfLimpo || null,
      telefone: telefoneLimpo || null,
      dataNascimento: v.dataNascimento || null,
      perfilId: PERFIL_CLIENTE_ID,
      enderecos: [endereco]
    };

    // Envia os dados para o serviço de autenticação para registrar o usuário
    this.authService.registrar(payload).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error(err);
        alert('Não foi possível realizar o cadastro.');
      }
    });
  }
}