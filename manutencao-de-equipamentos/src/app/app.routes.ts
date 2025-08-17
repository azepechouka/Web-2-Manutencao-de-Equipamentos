import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AutocadastroComponent } from './pages/autocadastro/autocadastro.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'autocadastro', component: AutocadastroComponent },
    { path: 'home', component: HomeComponent }
];