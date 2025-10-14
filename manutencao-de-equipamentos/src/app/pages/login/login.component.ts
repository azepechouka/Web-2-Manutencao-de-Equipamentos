import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Perfil } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      perfil: ['USUARIO' as Perfil] // opcional no UI; não é enviado ao backend
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, senha } = this.loginForm.value as { email: string; senha: string };

    this.auth.login(email, senha).subscribe({
      next: (user) => {
        const target = this.auth.hasPerfil('FUNCIONARIO') ? '/home-func' : '/home';
        this.router.navigate([target]);
      },
      error: (err) => {
        console.error(err);
        alert('Falha no login: verifique suas credenciais.');
      }
    });
  }
}