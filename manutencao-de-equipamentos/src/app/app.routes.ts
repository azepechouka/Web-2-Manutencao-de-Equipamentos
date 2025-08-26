import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'autocadastro',
    loadComponent: () => import('./pages/autocadastro/autocadastro.component').then(m => m.AutocadastroComponent)
  },
  {
    path: 'solicitacao',
    loadComponent: () => import('./pages/solicitacao/solicitacao.component').then(m => m.SolicitacaoComponent)
  },
  {
    path: 'visualizar-servico/:id',
    loadComponent: () => import('./pages/visualizar-servico/visualizar-servico.component').then(m => m.VisualizarServicoComponent)
  }
];