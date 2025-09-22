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

  resultados$: Observable<Orcamento[]> = of([]);
  buscando = signal(false);

  // cache e agregados
  currentData = signal<Orcamento[]>([]);
  totalValor = signal<number>(0);
  totalCount = signal<number>(0);

  buscar(): void {
    if (this.filtro.invalid) {
      this.filtro.markAllAsTouched();
      return;
    }

    const { dataIni, dataFim } = this.filtro.value;
    const ini = new Date(`${dataIni}T00:00:00`);
    const fim = new Date(`${dataFim}T00:00:00`);

    this.buscando.set(true);
    this.resultados$ = this.orcamentosSvc.listarPorPeriodo$(ini, fim).pipe(
      tap(res => {
        console.log('Orçamentos filtrados:', res);
        this.currentData.set(res);

        // agrega
        const soma = res.reduce((acc, o) => acc + (o.valorTotal ?? 0), 0);
        this.totalValor.set(soma);
        this.totalCount.set(res.length);
      }),
      finalize(() => this.buscando.set(false))
    );
  }

  limpar(): void {
    this.filtro.reset();
    this.resultados$ = of([]);
    this.currentData.set([]);
    this.totalValor.set(0);
    this.totalCount.set(0);
  }

  exportarPDF(): void {
    const dados = this.currentData();
    if (!dados.length) {
      console.warn('Sem dados para exportar.');
      return;
    }

    const { dataIni, dataFim } = this.filtro.value;
    const periodoStr = `Período: ${dataIni ?? '-'} até ${dataFim ?? '-'}`;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;

    // título e período
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Relatório de Orçamentos', marginX, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(periodoStr, marginX, 60);

    // resumo (qtd + total)
    const moedaFmt = (v: number, m?: string) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: m ?? 'BRL' }).format(v);

    const total = this.totalValor();
    const count = this.totalCount();
    doc.text(`Resumo: ${count} orçamento(s) — Total: ${moedaFmt(total, 'BRL')}`, marginX, 76);

    // tabela
    const rows: RowInput[] = dados.map(o => ([
      o.id,
      o.solicitacaoId,
      moedaFmt(o.valorTotal, o.moeda),
      new Date(o.criadoEm).toLocaleString('pt-BR'),
      o.observacao ?? ''
    ]));

    autoTable(doc, {
      startY: 92,
      head: [['ID', 'Solicitação', 'Valor', 'Data', 'Observação']],
      body: rows,
      // rodapé com totais
      foot: [[
        '',                              // ID
        `Qtde: ${count}`,                // Solicitação (usado para exibir qtde)
        moedaFmt(total, 'BRL'),          // Valor total
        '',                              // Data
        ''                               // Observação
      ]],
      styles: { fontSize: 9, cellPadding: 6, overflow: 'linebreak' },
      headStyles: { fillColor: [33, 150, 243] },
      columnStyles: {
        0: { halign: 'right', cellWidth: 40 },
        1: { halign: 'right', cellWidth: 80 },
        2: { halign: 'right', cellWidth: 90 },
        3: { halign: 'left',  cellWidth: 140 },
        4: { halign: 'left' },
      },
      didDrawPage: () => {
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.getWidth();
        const pageHeight = pageSize.getHeight();
        doc.setFontSize(9);
        doc.text(`Página ${doc.getNumberOfPages()}`, pageWidth - marginX, pageHeight - 20, { align: 'right' });
      },
      margin: { left: marginX, right: marginX },
    });

    doc.save('relatorio-orcamentos.pdf');
  }

  trackById(_: number, o: Orcamento) {
    return o.id;
  }
}
