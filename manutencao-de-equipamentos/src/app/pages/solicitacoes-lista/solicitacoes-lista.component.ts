import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SolicitacoesService } from '../../services/solicitacoes.service';

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

    this.svc.listTodasResumo$().subscribe({
      next: (all) => {
        const filtrados = all.filter(s => this.matchesFiltro(s, tipo, ini, fim));
        filtrados.sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime());
        this.itens.set(filtrados);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  private matchesFiltro(s: ViewItem, tipo: FiltroTipo, ini: string | null, fim: string | null): boolean {
    if (tipo === 'TODAS') {
        return true;
    }

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
    const upperCaseCode = code.toUpperCase();
    const colorMap: Record<string, string> = {
      'ABERTA': '#6c757d',
      'ORÇADA': '#795548',
      'ORCADA': '#795548',
      'REJEITADA': '#dc3545',
      'APROVADA': '#ffc107',
      'REDIRECIONADA': '#6f42c1',
      'ARRUMADA': '#0d6efd',
      'PAGA': '#fd7e14',
      'FINALIZADA': '#198754',
      'CRIADA': '#6c757d',
      'EM_EXEC': '#6f42c1',
      'CONCLUIDA': '#198754',
    };

    const backgroundColor = colorMap[upperCaseCode] ?? '#6c757d';
    const textColor = this.getContrastingTextColor(backgroundColor);

    return {
      'display': 'inline-block',
      'padding': '.2rem .5rem',
      'border-radius': '999px',
      'background-color': backgroundColor,
      'color': textColor,
      'font-size': '.85rem',
      'font-weight': '600',
    };
  }

  private getContrastingTextColor(hexColor: string): string {
    const cleanHex = hexColor.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#111' : '#fff';
  }

  acao(item: ViewItem): AcaoDisponivel | null {
    const code = item.statusCodigo.toUpperCase();
    switch (code) {
      case 'CRIADA':
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
    const confirmacao = confirm(`Tem certeza que deseja finalizar a solicitação #${id}?`);
    if (!confirmacao) {
      return;
    }

    this.itens.update(currentItems => {
      const itemsAtualizados = currentItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            statusCodigo: 'FINALIZADA',
            statusNome: 'Finalizada',
          };
        }
        return item;
      });
      return itemsAtualizados;
    });

    console.log(`Solicitação #${id} foi movida para o estado FINALIZADA no frontend.`);
    alert(`Solicitação #${id} finalizada com sucesso!`);
  }

  trackById = (_: number, i: ViewItem): number => i.id;
}