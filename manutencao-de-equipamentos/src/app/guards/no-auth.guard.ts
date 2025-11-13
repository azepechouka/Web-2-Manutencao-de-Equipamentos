import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const autenticado = auth.isAuthenticated();

  console.log('%c[NO-AUTH GUARD]', 'color: red;', {
    autenticado,
    usuario: auth.getUsuario()
  });

  if (!autenticado) return true;

  const perfis = auth.getPerfis();

  if (perfis.includes('FUNCIONARIO')) {
    router.navigate(['/home-func']);
  } else {
    router.navigate(['/home']);
  }

  return false;
};
