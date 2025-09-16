import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AutocadastroComponent } from './pages/autocadastro/autocadastro.component';
import { SolicitacaoComponent } from './pages/solicitacao/solicitacao.component';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';
import { RejeitarServicoComponent } from './pages/rejeitar-servico/rejeitar-servico.component';
import { PagarServicoComponent } from './pages/pagar-servico/pagar-servico.component';
import { EfetuarManutencaoComponent } from './efetuar-manutencao/efetuar-manutencao.component';
import { RedirecionarManutencaoComponent } from './redirecionar-manutencao/redirecionar-manutencao.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'autocadastro', component: AutocadastroComponent },
    { path: 'home', component: HomeComponent },
    { path: 'solicitacao', component: SolicitacaoComponent }, // Rota para criar solicitação
    { path: 'solicitacao/:id', component: VisualizarServicoComponent }, // Rota para visualizar detalhes
    { path: 'visualizar-servico/:id', component: VisualizarServicoComponent }, // Rota alternativa para visualizar detalhes
    { path: 'rejeitar-servico/:id', component: RejeitarServicoComponent }, // Rota para rejeitar serviço
    { path: 'pagar-servico', component: PagarServicoComponent }, // Rota para pagar serviço
    { path: 'efetuar-manutencao', component: EfetuarManutencaoComponent },
    { path: 'redirecionar-manutencao/:solicitacao', component: RedirecionarManutencaoComponent }
];