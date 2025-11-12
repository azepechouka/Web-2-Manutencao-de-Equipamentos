import { Component, inject, signal } from '@angular/core';
import { CommonModule, AsyncPipe, CurrencyPipe, DatePipe, NgIf, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { OrcamentosService } from '../../services/orcamento.service';
import { Orcamento } from '../../models/orcamento.model';

// PDF
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

@Component({
  selector: 'app-orcamento-filtro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe, CurrencyPipe, DatePipe, NgIf, NgFor],
  templateUrl: './relatorio-receita.component.html',
})
export class RelatorioReceitaComponent {
  private fb = inject(FormBuilder);
  private orcamentosSvc = inject(OrcamentosService);

  filtro = this.fb.group({
    dataIni: [null as string | null, Validators.required],
    dataFim: [null as string | null, Validators.required],
  });

 
}
