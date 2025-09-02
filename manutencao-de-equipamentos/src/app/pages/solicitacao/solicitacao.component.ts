import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Solicitacao } from '../../models/solicitacao.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-solicitacao',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, ReactiveFormsModule],
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css'],
})
export class SolicitacaoComponent implements OnInit {
  solicitacaoEnviada!: Solicitacao;
  formAprovar!: FormGroup;
  formRejeitar!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private service: SolicitacoesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    // this.solicitacaoEnviada = this.service.getById(+id!);

    this.formAprovar = this.fb.group({
     
    });

    this.formRejeitar = this.fb.group({
      motivo: ['', Validators.required],
    });
  }

  aprovar() {
    if (this.formAprovar.valid) {
      this.service
        .aprovarOrcamento(this.solicitacaoEnviada.id)
        .subscribe((ok: boolean) => {
          if (ok) {
            console.log('Orçamento aprovado com sucesso.');
            
          } else {
            console.error('Falha ao aprovar orçamento.');
          }
        });
    }
  }

  rejeitar() {
    if (this.formRejeitar.valid) {
      const motivo = this.formRejeitar.get('motivo')?.value;
      this.service
        .rejeitarOrcamento(this.solicitacaoEnviada.id, motivo) 
        .subscribe((ok: boolean) => { 
          if (ok) {
            console.log('Orçamento rejeitado com sucesso.');
          } else {
            console.error('Falha ao rejeitar orçamento.');
          }
        });
    }
  }
}