import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AutocadastroComponent } from './pages/autocadastro/autocadastro.component';
import { SolicitacaoComponent } from './pages/solicitacao/solicitacao.component';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';
import { PagarServicoComponent } from './pages/pagar-servico/pagar-servico.component'; // Importar o novo componente

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'autocadastro', component: AutocadastroComponent },
    { path: 'solicitacao', component: SolicitacaoComponent },
    { path: 'visualizar-servico', component: VisualizarServicoComponent },
    { path: 'pagar-servico', component: PagarServicoComponent }, // Adicionar a nova rota
];