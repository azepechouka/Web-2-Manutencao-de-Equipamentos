import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, of, startWith, switchMap } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { SolicitacoesService } from '../../services/solicitacoes.service';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

export interface ReceitaCategoriaItem {
  categoriaId: number | null;
  categoriaDescricao: string;
  total: number;
  quantidade: number;
  primeira: string | null;
  ultima: string | null;
}

type VM = {
  itens: ReceitaCategoriaItem[];
  totalGeral: number;
  qtdGeral: number;
};

type FiltroCatValue = 'ALL' | 'NULL' | number;
type CategoriaOption = { value: FiltroCatValue; label: string };

@Component({
  selector: 'app-relatorio-categorias',
  standalone: true,
  imports: [CommonModule, AsyncPipe, CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './relatorio-categorias.component.html',
})
export class RelatorioCategoriasComponent {
 
}
