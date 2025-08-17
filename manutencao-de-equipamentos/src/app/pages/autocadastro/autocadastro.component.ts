import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
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
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]]
    });
  }

  buscarCep() {
    const cep = this.cadastroForm.get('cep')?.value;

    if (cep && cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((dados: any) => {
        this.cadastroForm.patchValue({
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf
        });
      });
    }
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      console.log('Formulário enviado!', this.cadastroForm.value);
      // Aqui você implementaria a lógica para enviar os dados ao backend
      alert('Cadastro realizado com sucesso! (Simulação)');
      this.router.navigate(['/login']);
    } else {
      console.log('Formulário inválido.');
    }
  }
}