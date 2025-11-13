import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const autenticado = auth.isAuthenticated();

  if (!autenticado) return true;

  const perfis = auth.getPerfis();

  if (perfis.includes('FUNCIONARIO')) {
    router.navigate(['/home-func']);
  } else {
    router.navigate(['/home']);
  }

  return false;
};
