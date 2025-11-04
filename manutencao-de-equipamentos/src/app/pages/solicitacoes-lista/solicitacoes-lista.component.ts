import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';
import { Solicitacao } from '../../models/solicitacao.model';

type ViewItem = {
  id: number;
  criadoEm: string;
  clienteNome: string;
  equipamentoDesc: string;
  statusCodigo: string;
  statusNome: string;
};

type FiltroTipo = 'HOJE' | 'PERIODO' | 'TODAS';

type AcaoDisponivel = {
  label: string;
  link?: any[];
  action?: () => void;
};

@Component({
  selector: 'app-solicitacoes-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DatePipe],
  templateUrl: './solicitacoes-lista.component.html',
})
export class SolicitacoesListaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(SolicitacoesService);
  private router = inject(Router);

  itens = signal<ViewItem[]>([]);
  carregando = signal<boolean>(false);

  filtro = this.fb.group({
    tipo: ['TODAS' as FiltroTipo, Validators.required],
    ini: [null as string | null],
    fim: [null as string | null],
  });

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    const { tipo, ini, fim } = this.filtro.value as { tipo: FiltroTipo; ini: string | null; fim: string | null };
    this.carregando.set(true);

    this.svc.listTodas().subscribe({
      next: (solicitacoes: Solicitacao[]) => {
        // converte para ViewItem
        const viewItems: ViewItem[] = solicitacoes.map((s) => ({
          id: s.id,
          criadoEm: s.criadoEm,
          clienteNome: `Cliente #${s.clienteId}`,
          equipamentoDesc: s.descricaoEquipamento ?? '',
          statusCodigo: this.mapStatusCodigo(s.statusAtualId),
          statusNome: this.mapStatusNome(s.statusAtualId),
        }));

        const filtrados = viewItems.filter((s) => this.matchesFiltro(s, tipo, ini, fim));
        filtrados.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

        this.itens.set(filtrados);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  private mapStatusCodigo(statusId: number): string {
    const map: Record<number, string> = {
      1: 'ABERTA',
      2: 'ORCADA',
      3: 'APROVADA',
      4: 'REJEITADA',
      5: 'REDIRECIONADA',
      6: 'ARRUMADA',
      7: 'PAGA',
      8: 'FINALIZADA',
    };
    return map[statusId] ?? 'DESCONHECIDO';
  }

  private mapStatusNome(statusId: number): string {
    const map: Record<number, string> = {
      1: 'Aberta',
      2: 'Orçada',
      3: 'Aprovada',
      4: 'Rejeitada',
      5: 'Redirecionada',
      6: 'Arrumada',
      7: 'Paga',
      8: 'Finalizada',
    };
    return map[statusId] ?? 'Desconhecido';
  }

  private matchesFiltro(s: ViewItem, tipo: FiltroTipo, ini: string | null, fim: string | null): boolean {
    if (tipo === 'TODAS') return true;

    const dataSolicitacao = new Date(s.criadoEm);

    if (tipo === 'HOJE') {
      const hoje = new Date();
      const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0, 0);
      const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999);
      return dataSolicitacao >= inicioDoDia && dataSolicitacao <= fimDoDia;
    }

    if (tipo === 'PERIODO') {
      if (!ini || !fim) return true;
      const inicioPeriodo = new Date(`${ini}T00:00:00`);
      const fimPeriodo = new Date(`${fim}T23:59:59.999`);
      return dataSolicitacao >= inicioPeriodo && dataSolicitacao <= fimPeriodo;
    }

    return false;
  }

  badgeStyle(code: string): Record<string, string> {
    const upper = code.toUpperCase();
    const colorMap: Record<string, string> = {
      'ABERTA': '#6c757d',
      'ORCADA': '#795548',
      'REJEITADA': '#dc3545',
      'APROVADA': '#ffc107',
      'REDIRECIONADA': '#6f42c1',
      'ARRUMADA': '#0d6efd',
      'PAGA': '#fd7e14',
      'FINALIZADA': '#198754',
    };
    const bg = colorMap[upper] ?? '#6c757d';
    const fg = this.getContrastingTextColor(bg);
    return {
      display: 'inline-block',
      padding: '.2rem .5rem',
      borderRadius: '999px',
      backgroundColor: bg,
      color: fg,
      fontSize: '.85rem',
      fontWeight: '600',
    };
  }

  private getContrastingTextColor(hexColor: string): string {
    const c = hexColor.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#111' : '#fff';
  }

  acao(item: ViewItem): AcaoDisponivel | null {
    const code = item.statusCodigo.toUpperCase();
    switch (code) {
      case 'ABERTA':
        return { label: 'Efetuar Orçamento', link: ['/efetuar-orcamento', item.id] };
      case 'APROVADA':
      case 'REDIRECIONADA':
        return { label: 'Efetuar Manutenção', link: ['/efetuar-manutencao', item.id] };
      case 'PAGA':
        return { label: 'Finalizar Solicitação', action: () => this.finalizarSolicitacao(item.id) };
      default:
        return null;
    }
  }

  finalizarSolicitacao(id: number): void {
    if (!confirm(`Tem certeza que deseja finalizar a solicitação #${id}?`)) return;

    this.itens.update((atual) =>
      atual.map((item) =>
        item.id === id
          ? { ...item, statusCodigo: 'FINALIZADA', statusNome: 'Finalizada' }
          : item
      )
    );

    alert(`Solicitação #${id} finalizada com sucesso!`);
  }

  trackById = (_: number, i: ViewItem): number => i.id;
}
