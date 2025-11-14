import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import {  SolicitacaoResponse } from '../../models/solicitacao.model';
import { ReceitaDia } from '../../dtos/Receita-dia.dto';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

@Component({
  selector: 'app-relatorio-receita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, NgIf, NgFor],
  templateUrl: './relatorio-receita.component.html',
})
export class RelatorioReceitaComponent {
  private fb = inject(FormBuilder);
  private solicitacaoSvc = inject(SolicitacoesService);

  carregando = signal(false);
  dadosReceita = signal<ReceitaDia[]>([]);
  totalGeral = signal(0);
  totalServicos = signal(0);

  filtro = this.fb.group({
    dataIni: [null as string | null, Validators.required],
    dataFim: [null as string | null, Validators.required],
  });

  gerarRelatorio(): void {
    if (this.filtro.invalid) {
      alert('Preencha o período.');
      return;
    }

    const dataIni = this.filtro.value.dataIni ?? null;
    const dataFim = this.filtro.value.dataFim ?? null;

    this.carregando.set(true);

    this.solicitacaoSvc.relatorioReceita(dataIni, dataFim)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: dados => {
          this.dadosReceita.set(dados);
          this.calcularTotais(dados);
        },
        error: err => {
          console.error(err);
          alert('Erro ao gerar relatório.');
        }
      });
  }

  private calcularTotais(dias: ReceitaDia[]): void {
    const total = dias.reduce((sum, d) => sum + d.totalReceita, 0);
    const qtd = dias.reduce((sum, d) => sum + d.quantidadeServicos, 0);

    this.totalGeral.set(total);
    this.totalServicos.set(qtd);
  }

  gerarPDF(): void {
    const dados = this.dadosReceita();

    if (dados.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    const doc = new jsPDF();
    const dataIni = this.filtro.value.dataIni ?? '';
    const dataFim = this.filtro.value.dataFim ?? '';

    doc.setFontSize(16);
    doc.text('Relatório de Receita', 14, 15);

    doc.setFontSize(10);
    const periodo =
      dataIni && dataFim
        ? `Período: ${this.formatarData(dataIni)} até ${this.formatarData(dataFim)}`
        : 'Período: Completo';

    doc.text(periodo, 14, 25);

    let yPos = 40;

    dados.forEach(dia => {
      doc.setFont('undefined', 'bold');
      doc.text(
        `Data: ${this.formatarData(dia.data)} - Receita: R$ ${dia.totalReceita.toFixed(2)} - Serviços: ${dia.quantidadeServicos}`,
        14,
        yPos
      );

      yPos += 10;

      const rows: RowInput[] = (dia.solicitacoes ?? []).map((s: SolicitacaoResponse) => [
        String(s.id ?? ''),
        s.descricaoEquipamento ?? '',
        s.clienteNome ?? '',
        s.estadoAtual ?? '',
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['ID', 'Equipamento', 'Cliente', 'Status']],
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] }
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.setFont('undefined', 'bold');
    doc.text(
      `TOTAL RECEITA: R$ ${this.totalGeral().toFixed(2)} | TOTAL SERVIÇOS: ${this.totalServicos()}`,
      14,
      yPos + 10
    );

    doc.save(`relatorio-receita-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private formatarData(data: string | null | undefined): string {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  limparFiltro(): void {
    this.filtro.reset();
    this.dadosReceita.set([]);
    this.totalGeral.set(0);
    this.totalServicos.set(0);
  }
}
