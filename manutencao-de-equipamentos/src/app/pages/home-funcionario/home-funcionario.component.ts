import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitacoesService, ListItemRF011 } from '../../services/solicitacoes.service';

@Component({
  selector: 'app-home-funcionario',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './home-funcionario.component.html',
  styleUrls: ['./home-funcionario.component.css']
})
export class HomeFuncionarioComponent implements OnInit {
  private service = inject(SolicitacoesService);
  private router = inject(Router);

  solicitacoesAbertas$?: Observable<ListItemRF011[]>;

  ngOnInit(): void {
    this.solicitacoesAbertas$ = this.service.listAbertasParaFuncionario();
  }

  efetuarOrcamento(id: number) {
   
    console.log('Navegar para efetuar orçamento da solicitação:', id);
    
  }
}