import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Perfil } from '../../services/auth.service'; // ajuste o path conforme sua estrutura

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
    private router: Router,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      perfil: ['FUNCIONARIO', [Validators.required]], // default
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      console.log('Formulário de login inválido.');
      return;
    }

    const { email, senha, perfil } = this.loginForm.value as { email: string; senha: string; perfil: Perfil };

    try {
      const user = this.auth.login(email, senha, perfil);
      console.log('Login OK:', user);
      // redireciona conforme o perfil, se quiser
      const target = this.auth.hasPerfil('FUNCIONARIO') ? '/home-func' : '/home';
      this.router.navigate([target]);
    } catch (e) {
      console.error(e);
      alert('Falha no login (simulação): verifique os dados.');
    }
  }
}
