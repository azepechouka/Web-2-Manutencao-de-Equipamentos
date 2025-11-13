import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { funcionarioGuard } from './guards/funcionario.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { clienteGuard } from './guards/cliente.guard';
import { LoginComponent } from './pages/login/login.component';
import { AutocadastroComponent } from './pages/autocadastro/autocadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { SolicitacaoComponent } from './pages/solicitacao/solicitacao.component';
import { EfetuarManutencaoComponent } from './efetuar-manutencao/efetuar-manutencao.component';
import { RedirecionarManutencaoComponent } from './redirecionar-manutencao/redirecionar-manutencao.component';
import { CrudFuncionarioComponent } from './crud-funcionario/crud-funcionario.component';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';
import { RejeitarServicoComponent } from './pages/rejeitar-servico/rejeitar-servico.component';
import { RelatorioReceitaComponent } from './pages/relatorio-receita/relatorio-receita.component';
import { FuncHomeComponent } from './pages/func-home/func-home.component';
import { EfetuarOrcamentoComponent } from './pages/efetuar-orcamento/efetuar-orcamento.component';
import { SolicitacoesListaComponent } from './pages/solicitacoes-lista/solicitacoes-lista.component';
import { CategoriasEquipamentoComponent } from './pages/categorias-equipamento/categorias-equipamento.component';
import { RelatorioCategoriasComponent } from './pages/relatorio-categorias/relatorio-categorias.component';
import { MostrarOrcamentoComponent } from './mostrar-orcamento/mostrar-orcamento.component';
import { ResgatarServicoComponent } from './resgatar-servico/resgatar-servico.component';
import { PagarServicoComponent } from './pagar-servico/pagar-servico.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'autocadastro', component: AutocadastroComponent, canActivate: [noAuthGuard] },

    // Área do Cliente
    { path: 'home', component: HomeComponent, canActivate: [authGuard, clienteGuard] },
    { path: 'solicitacao', component: SolicitacaoComponent, canActivate: [authGuard, clienteGuard] },
    { path: 'solicitacao/:id', component: VisualizarServicoComponent, canActivate: [authGuard, clienteGuard] },
    { path: 'rejeitar-servico/:id', component: RejeitarServicoComponent, canActivate: [authGuard, clienteGuard] },
    { path: 'pagar-servico/:id', component: PagarServicoComponent, canActivate: [authGuard, clienteGuard] },
    { path: 'mostrar-orcamento/:id', component: MostrarOrcamentoComponent, canActivate: [authGuard, clienteGuard] },

    // Área do Funcionário
    { path: 'home-func', component: FuncHomeComponent, canActivate: [authGuard, funcionarioGuard] },
    { path: 'efetuar-orcamento/:id', component: EfetuarOrcamentoComponent, canActivate: [authGuard, funcionarioGuard] },
    { path: 'efetuar-manutencao/:id', component: EfetuarManutencaoComponent, canActivate: [authGuard, funcionarioGuard] },
    { path: 'redirecionar-manutencao/:solicitacao', component: RedirecionarManutencaoComponent, canActivate: [authGuard, funcionarioGuard] },
    { path: 'crudFuncionario', component: CrudFuncionarioComponent, canActivate: [authGuard, funcionarioGuard] },
    { path: 'relatorioReceita', component: RelatorioReceitaComponent, canActivate: [authGuard, funcionarioGuard] },
    { path: 'relatorio-categoria', component: RelatorioCategoriasComponent, canActivate: [authGuard, funcionarioGuard] },
    { path: 'listaSolicitacoes', component: SolicitacoesListaComponent, canActivate: [authGuard, funcionarioGuard] },
    { path: 'cadastrarcategoria', component: CategoriasEquipamentoComponent, canActivate: [authGuard, funcionarioGuard] },

    // Comum
    { path: 'resgatar-servico/:id', component: ResgatarServicoComponent, canActivate: [authGuard, funcionarioGuard] }
];