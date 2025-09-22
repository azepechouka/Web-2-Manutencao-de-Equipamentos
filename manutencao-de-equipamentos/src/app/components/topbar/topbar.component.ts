import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // ajuste o path

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'] // corrigido: styleUrls (plural)
})
export class TopbarComponent {
  public auth = inject(AuthService);
  private router = inject(Router);

  isFuncionario(): boolean { return this.auth.hasPerfil('FUNCIONARIO'); }
  isUsuario(): boolean { return this.auth.hasPerfil('USUARIO'); }
  usuarioNome(): string { return this.auth.getUsuario()?.nome ?? 'Visitante'; }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
