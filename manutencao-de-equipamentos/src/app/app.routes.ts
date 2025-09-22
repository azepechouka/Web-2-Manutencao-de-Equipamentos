// src/app/app.routes.ts

import { Routes } from '@angular/router';
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

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'autocadastro', component: AutocadastroComponent },
    { path: 'home', component: HomeComponent },
    { path: 'solicitacao', component: SolicitacaoComponent },
    { path: 'solicitacao/:id', component: VisualizarServicoComponent },
    { path: 'rejeitar-servico/:id', component: RejeitarServicoComponent },
    { path: 'efetuar-manutencao/:id', component: EfetuarManutencaoComponent },
    { path: 'redirecionar-manutencao/:solicitacao', component: RedirecionarManutencaoComponent },
    { path: 'crudFuncionario', component: CrudFuncionarioComponent },
    { path: 'relatorioReceita', component: RelatorioReceitaComponent },
    { path: 'home-func', component: FuncHomeComponent },
    { path: 'efetuar-orcamento/:id', component: EfetuarOrcamentoComponent },
    { path: 'listaSolicitacoes', component: SolicitacoesListaComponent },
    { path: 'cadastrarcategoria', component: CategoriasEquipamentoComponent },
    { path: 'relatorio-categoria', component: RelatorioCategoriasComponent },
];