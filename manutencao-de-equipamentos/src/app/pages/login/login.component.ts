import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Dados do Login:', this.loginForm.value);
      // Aqui virá a lógica de autenticação com o backend.
      // Por enquanto, vamos simular um login bem-sucedido.

      alert('Login efetuado com sucesso! (Simulação)');
      this.router.navigate(['/home']); // Redireciona para a página inicial
    } else {
      console.log('Formulário de login inválido.');
    }
  }
}