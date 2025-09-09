import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TopbarComponent } from './components/topbar/topbar.component';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  // Adicione o CommonModule aqui para poder usar o *ngIf
  imports: [RouterOutlet, TopbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'manutencao-de-equipamentos';
  showTopbar: boolean = true;

  // Injetamos o Router no construtor
  constructor(private router: Router) {
    // Escutamos as mudanças de rota
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Verificamos a URL atual
      if (event.url === '/login' || event.url === '/autocadastro' || event.url === '/') {
        this.showTopbar = false;
      } else {
        this.showTopbar = true;
      }
    });
  }
}