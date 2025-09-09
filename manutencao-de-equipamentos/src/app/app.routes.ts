// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AutocadastroComponent } from './pages/autocadastro/autocadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { SolicitacaoComponent } from './pages/solicitacao/solicitacao.component';
import { EfetuarManutencaoComponent } from './efetuar-manutencao/efetuar-manutencao.component';
import { RedirecionarManutencaoComponent } from './redirecionar-manutencao/redirecionar-manutencao.component';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'autocadastro', component: AutocadastroComponent },
    { path: 'home', component: HomeComponent },
    { path: 'solicitacao', component: SolicitacaoComponent }, // Rota para criar solicitação
    { path: 'solicitacao/:id', component: VisualizarServicoComponent }, // Rota para visualizar detalhes
    { path: 'efetuar-manutencao', component: EfetuarManutencaoComponent },
    { path: 'redirecionar-manutencao/:solicitacao', component: RedirecionarManutencaoComponent }
];