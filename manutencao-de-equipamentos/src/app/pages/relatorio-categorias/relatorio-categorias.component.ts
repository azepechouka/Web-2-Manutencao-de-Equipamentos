import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { ReceitaCategoria } from '../../dtos/receita-categoria.dto';
import { finalize } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

@Component({
  selector: 'app-relatorio-categoria',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './relatorio-categorias.component.html',
})
export class RelatorioCategoriaComponent { 
  private solicitacaoSvc = inject(SolicitacoesService);

  carregando = signal(false);
  dadosCategoria = signal<ReceitaCategoria[]>([]);
  totalGeral = signal(0);
  today = new Date();

  ngOnInit(): void {
    this.gerarRelatorio();
  }

  gerarRelatorio(): void {
    this.carregando.set(true);

    this.solicitacaoSvc.relatorioReceitaPorCategoria()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (dados: ReceitaCategoria[]) => {
          this.dadosCategoria.set(dados);
          this.calcularTotalGeral(dados);
        },
        error: err => {
          console.error(err);
          alert('Erro ao gerar relatório.');
        }
      });
  }

  private calcularTotalGeral(categorias: ReceitaCategoria[]): void {
    const total = categorias.reduce((sum, cat) => sum + cat.totalReceita, 0);
    this.totalGeral.set(total);
  }

  calcularPercentual(valorCategoria: number): string {
    const total = this.totalGeral();
    if (total === 0) return '0';
    return ((valorCategoria / total) * 100).toFixed(1);
  }

  gerarPDF(): void {
    const dados = this.dadosCategoria();

    if (dados.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Relatório de Receita por Categoria', 14, 15);

    doc.setFontSize(10);
    doc.text(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}`, 14, 25);

    const rows: RowInput[] = dados.map(categoria => [
      categoria.categoriaNome ?? 'N/A',
      `R$ ${categoria.totalReceita.toFixed(2)}`,
      this.calcularPercentual(categoria.totalReceita) + '%'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Categoria', 'Receita Total', 'Percentual']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      foot: [['TOTAL GERAL', `R$ ${this.totalGeral().toFixed(2)}`, '100%']],
      footStyles: { fillColor: [100, 100, 100] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    this.adicionarGraficoPizza(doc, dados, finalY);

    doc.save(`relatorio-categoria-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private adicionarGraficoPizza(doc: jsPDF, dados: ReceitaCategoria[], yPos: number): void {
    if (dados.length === 0) return;

    doc.setFontSize(12);
    doc.text('Distribuição por Categoria:', 14, yPos);

    let currentY = yPos + 10;
    const colors = [
      [255, 99, 132], [54, 162, 235], [255, 206, 86], 
      [75, 192, 192], [153, 102, 255], [255, 159, 64]
    ];

    dados.forEach((categoria, index) => {
      const color = colors[index % colors.length];
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(14, currentY, 5, 5, 'F');
      
      doc.setFontSize(10);
      const text = `${categoria.categoriaNome}: R$ ${categoria.totalReceita.toFixed(2)} (${this.calcularPercentual(categoria.totalReceita)}%)`;
      doc.text(text, 22, currentY + 4);
      
      currentY += 8;
    });
  }

  atualizarRelatorio(): void {
    this.gerarRelatorio();
  }
}