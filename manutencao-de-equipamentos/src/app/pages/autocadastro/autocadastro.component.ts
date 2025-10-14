import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Endereco } from '../../models/endereco.model';
import { UsuarioCreateDto } from '../../dtos/usuario-create.dto';

const PERFIL_CLIENTE_ID = 1;

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
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: [''],
      telefone: [''],
      dataNascimento: ['', [this.dataIsoValidator]],
      perfilId: [PERFIL_CLIENTE_ID, [Validators.required]],
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      }),
    });

    this.cadastroForm.get('endereco.uf')?.valueChanges.subscribe(v => {
      if (typeof v === 'string' && v !== v.toUpperCase()) {
        this.cadastroForm.get('endereco.uf')?.setValue(v.toUpperCase(), { emitEvent: false });
      }
    });
  }

  private dataIsoValidator(ctrl: AbstractControl): ValidationErrors | null {
    const v: string = ctrl.value;
    if (!v) return null;
    return /^\d{4}-\d{2}-\d{2}$/.test(v) ? null : { dataInvalida: true };
  }

  buscarCep() {
    const cep = this.cadastroForm.get('endereco.cep')?.value?.replace(/\D/g, '');
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
          }
        }
      });
    }
  }

  onSubmit() {
    if (!this.cadastroForm.valid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const v = this.cadastroForm.value as any;

    const endereco: Endereco = {
      cep: v.endereco.cep,
      logradouro: v.endereco.logradouro,
      numero: v.endereco.numero,
      complemento: v.endereco.complemento || null,
      bairro: v.endereco.bairro,
      cidade: v.endereco.cidade,
      uf: v.endereco.uf
    };

    const payload: UsuarioCreateDto = {
      nome: v.nome,
      email: v.email,
      cpf: v.cpf || null,
      telefone: v.telefone || null,
      dataNascimento: v.dataNascimento || null,
      perfilId: PERFIL_CLIENTE_ID,
      enderecos: [endereco]
    };

    this.authService.registrar(payload).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Não foi possível realizar o cadastro.');
      }
    });
  }
}
