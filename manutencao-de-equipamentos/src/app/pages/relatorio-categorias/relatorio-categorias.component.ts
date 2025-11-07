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
  private readonly svc = inject(SolicitacoesService);
  private readonly catSvc = inject(CategoriaEquipamentoService);

  private readonly categoriasLookup$ = this.catSvc
    .getAll()
    .pipe(
      map(arr =>
        arr.reduce((acc, c) => {
          acc[c.id] = c.nome;
          return acc;
        }, {} as Record<number, string>)
      )
    );

  private readonly relatorioReceitaPorCategoria$ = (lookup: Record<number, string>) =>
    this.svc.listTodas().pipe(
      map((solics): ReceitaCategoriaItem[] => {
        const mapCategorias = new Map<number | null, ReceitaCategoriaItem>();

        solics.forEach((s) => {
          const categoriaId = s.categoriaEquipamento?.id ?? null;
          const item =
            mapCategorias.get(categoriaId) ||
            ({
              categoriaId,
              categoriaDescricao: lookup[categoriaId ?? 0] || 'Sem Categoria',
              total: 0,
              quantidade: 0,
              primeira: s.criadoEm,
              ultima: s.criadoEm,
            } as ReceitaCategoriaItem);

          item.total += Math.random() * 500;
          item.quantidade += 1;
          item.ultima = s.criadoEm;
          mapCategorias.set(categoriaId, item);
        });

        return Array.from(mapCategorias.values());
      })
    );

  private readonly vmBase$ = this.categoriasLookup$.pipe(
    switchMap((lookup: Record<number, string>) => this.relatorioReceitaPorCategoria$(lookup)),
    map((itens: ReceitaCategoriaItem[]): VM => ({
      itens,
      totalGeral: itens.reduce((s: number, x: ReceitaCategoriaItem) => s + x.total, 0),
      qtdGeral: itens.reduce((s: number, x: ReceitaCategoriaItem) => s + x.quantidade, 0),
    }))
  );

  readonly opcoes$ = this.vmBase$.pipe(
    map((vm: VM) => {
      const opts: CategoriaOption[] = [{ value: 'ALL', label: 'Todas as categorias' }];

      if (vm.itens.some((i) => i.categoriaId == null)) {
        opts.push({ value: 'NULL', label: 'Sem categoria' });
      }

      const cats = vm.itens
        .filter((i) => i.categoriaId != null)
        .map((i) => ({ id: i.categoriaId as number, label: i.categoriaDescricao }));

      const uniq = new Map<number, string>();
      cats.forEach((c) => uniq.set(c.id, c.label));
      [...uniq.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
        .forEach(([id, label]) => opts.push({ value: id, label }));

      return opts;
    })
  );

  readonly filtroCtrl = new FormControl<FiltroCatValue>('ALL', { nonNullable: true });

  readonly vm$ = combineLatest([
    this.vmBase$,
    this.filtroCtrl.valueChanges.pipe(startWith(this.filtroCtrl.value)),
  ]).pipe(
    map(([vm, sel]: [VM, FiltroCatValue]): VM => {
      let itensFiltrados = vm.itens;
      if (sel !== 'ALL') {
        itensFiltrados =
          sel === 'NULL'
            ? vm.itens.filter((i) => i.categoriaId == null)
            : vm.itens.filter((i) => i.categoriaId === sel);
      }
      return {
        itens: itensFiltrados,
        totalGeral: itensFiltrados.reduce((s, x) => s + x.total, 0),
        qtdGeral: itensFiltrados.reduce((s, x) => s + x.quantidade, 0),
      };
    })
  );

  exportarPDF(): void {
    const subscription = this.vm$.subscribe((vm) => {
      const { itens, totalGeral, qtdGeral } = vm;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const marginX = 40;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Relatório de Receita por Categoria', marginX, 40);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const resumo = `${qtdGeral} orçamento(s) — Total: ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(totalGeral)}`;
      doc.text(resumo, marginX, 60);

      const rows = itens.map((item) => [
        item.categoriaDescricao,
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total),
        item.quantidade.toString(),
        item.primeira ? new Date(item.primeira).toLocaleDateString('pt-BR') : '-',
        item.ultima ? new Date(item.ultima).toLocaleDateString('pt-BR') : '-',
      ]);

      autoTable(doc, {
        startY: 80,
        head: [['Categoria', 'Receita (BRL)', 'Qtde. Orçamentos', 'Primeiro Orçamento', 'Último Orçamento']],
        body: rows,
        foot: [
          [
            'Total',
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral),
            qtdGeral.toString(),
            '',
            '',
          ],
        ],
        styles: { fontSize: 9, cellPadding: 6, overflow: 'linebreak' },
        headStyles: { fillColor: [33, 150, 243] },
      });

      doc.save('relatorio-receita-por-categoria.pdf');
      subscription.unsubscribe();
    });
  }

  trackByCategoria = (_: number, it: ReceitaCategoriaItem): number => it.categoriaId ?? -1;
}
