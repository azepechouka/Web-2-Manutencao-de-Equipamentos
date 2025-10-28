import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OrcamentosService } from '../../services/orcamento.service';
import { CategoriaService } from '../../services/categoria-equipamento.service';
import { SolicitacoesService, ReceitaCategoriaItem } from '../../services/solicitacoes.service';

// PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorio-categoria',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf],
  templateUrl: './relatorio-categoria.component.html'
})
export class RelatorioCategoriaComponent implements OnInit {
  private orcamentosSvc = inject(OrcamentosService);
  private categoriasSvc = inject(CategoriaService);
  private solicitacoesSvc = inject(SolicitacoesService);

  carregando = signal(true);
  resultados$!: Observable<ReceitaCategoriaItem[]>;

  // Totais para o rodapé do relatório
  totalGeral = signal(0);
  totalQtd = signal(0);
  currentData: ReceitaCategoriaItem[] = [];

  ngOnInit(): void {
    // Carrega as categorias primeiro para ter um mapa de nomes
    this.categoriasSvc.refresh().subscribe(() => {
      const categoriasMap = this.categoriasSvc.items$.getValue().reduce((acc: { [x: string]: any; }, cat: { id: string | number; nome: any; }) => {
        acc[cat.id] = cat.nome;
        return acc;
      }, {} as Record<number, string>);

      // Então, carrega o relatório
      this.resultados$ = this.solicitacoesSvc.relatorioReceitaPorCategoria$(categoriasMap).pipe(
        tap(data => {
          this.currentData = data;
          this.totalGeral.set(data.reduce((sum, item) => sum + item.total, 0));
          this.totalQtd.set(data.reduce((sum, item) => sum + item.quantidade, 0));
          this.carregando.set(false);
        })
      );
    });
  }

  exportarPDF(): void {
    if (!this.currentData.length) {
      alert('Não há dados para exportar.');
      return;
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;
    const now = new Date();

    // Título e data
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Relatório de Receita por Categoria', marginX, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`, marginX, 55);

    const rows = this.currentData.map(item => [
      item.categoriaDescricao,
      item.quantidade,
      this.formatCurrency(item.total),
      item.primeira ? new Date(item.primeira).toLocaleDateString('pt-BR') : '-',
      item.ultima ? new Date(item.ultima).toLocaleDateString('pt-BR') : '-',
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Categoria', 'Qtd. Orçamentos', 'Valor Total', 'Primeiro Orçamento', 'Último Orçamento']],
      body: rows,
      foot: [[
        'TOTAIS',
        this.totalQtd(),
        this.formatCurrency(this.totalGeral()),
        '',
        ''
      ]],
      styles: { fontSize: 9, cellPadding: 6, overflow: 'linebreak' },
      headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold' },
      footStyles: { fillColor: [241, 196, 15], fontStyle: 'bold' },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'center' },
        4: { halign: 'center' },
      },
    });

    doc.save('relatorio-receita-por-categoria.pdf');
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  trackById(_: number, item: ReceitaCategoriaItem): number | null {
    return item.categoriaId;
  }
}