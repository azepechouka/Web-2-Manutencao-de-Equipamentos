import { Component } from '@angular/core';
// 1. Importe o RouterLink e o RouterLinkActive
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  // 2. Adicione os módulos importados ao array 'imports'
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {

}