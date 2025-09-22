import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, of, startWith, switchMap } from 'rxjs';

import { SolicitacoesService, ReceitaCategoriaItem } from '../../services/solicitacoes.service';
// Opcional: se existir
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

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
  private svc = inject(SolicitacoesService);
  private catSvc = inject(CategoriaEquipamentoService, { optional: true });

  // Lookup (id -> descrição) vindo do service de categorias, se existir
  private categoriasLookup$ = this.catSvc
    ? this.catSvc.list$().pipe(
        map(arr => arr.reduce((acc, c) => { acc[c.id] = c.descricao; return acc; }, {} as Record<number, string>))
      )
    : of({} as Record<number, string>);

  // VM base (sem filtro)
  private vmBase$ = this.categoriasLookup$.pipe(
    switchMap(lookup => this.svc.relatorioReceitaPorCategoria$(lookup)),
    map((itens): VM => ({
      itens,
      totalGeral: itens.reduce((s, x) => s + x.total, 0),
      qtdGeral: itens.reduce((s, x) => s + x.quantidade, 0),
    }))
  );

  // Opções do select (derivadas do conteúdo atual)
  opcoes$ = this.vmBase$.pipe(
    map(vm => {
      const opts: CategoriaOption[] = [{ value: 'ALL', label: 'Todas as categorias' }];
      if (vm.itens.some(i => i.categoriaId == null)) {
        opts.push({ value: 'NULL', label: 'Sem categoria' });
      }
      const cats = vm.itens
        .filter(i => i.categoriaId != null)
        .map(i => ({ id: i.categoriaId as number, label: i.categoriaDescricao }));
      // remover duplicados e ordenar por label
      const mapUniq = new Map<number, string>();
      cats.forEach(c => mapUniq.set(c.id, c.label));
      [...mapUniq.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
        .forEach(([id, label]) => opts.push({ value: id, label }));
      return opts;
    })
  );

  // Controle do filtro
  filtroCtrl = new FormControl<FiltroCatValue>('ALL', { nonNullable: true });

  // VM final (com filtro aplicado)
  vm$ = combineLatest([
    this.vmBase$,
    this.filtroCtrl.valueChanges.pipe(startWith(this.filtroCtrl.value)),
  ]).pipe(
    map(([vm, sel]) => {
      let itens = vm.itens;
      if (sel !== 'ALL') {
        itens = sel === 'NULL'
          ? itens.filter(i => i.categoriaId == null)
          : itens.filter(i => i.categoriaId === sel);
      }
      return {
        itens,
        totalGeral: itens.reduce((s, x) => s + x.total, 0),
        qtdGeral: itens.reduce((s, x) => s + x.quantidade, 0),
      } as VM;
    })
  );

  trackByCategoria = (_: number, it: ReceitaCategoriaItem) => it.categoriaId ?? -1;
}
