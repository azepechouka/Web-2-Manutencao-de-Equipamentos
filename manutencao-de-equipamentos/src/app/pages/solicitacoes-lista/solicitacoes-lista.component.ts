import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-solicitacoes-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './solicitacoes-lista.component.html',
})
export class SolicitacoesListaComponent {
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
    this.buscar(); // carrega inicialmente como "TODAS"
  }

  buscar(): void {
    const { tipo, ini, fim } = this.filtro.value as { tipo: FiltroTipo; ini: string | null; fim: string | null };
    this.carregando.set(true);

    this.svc.listTodasResumo$().subscribe({
      next: (all) => {
        // Filtra
        const filtrados = all.filter(s => this.matchesFiltro(s, tipo, ini, fim));
        // Ordena por data/hora ascendente
        filtrados.sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime());
        this.itens.set(filtrados);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  private matchesFiltro(s: ViewItem, tipo: FiltroTipo, ini: string | null, fim: string | null): boolean {
    if (tipo === 'TODAS') return true;

    const dt = new Date(s.criadoEm);
    if (tipo === 'HOJE') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return dt >= start && dt <= end;
    }

    // PERIODO
    if (!ini || !fim) return true; // se faltar datas, não filtra
    const start = new Date(`${ini}T00:00:00`);
    const end = new Date(`${fim}T23:59:59.999`);
    return dt >= start && dt <= end;
  }

  // Cores por estado (aceita códigos do catálogo atual e os “novos” pedidos)
  badgeStyle(code: string): Record<string, string> {
    const c = code.toUpperCase();
    const map: Record<string, string> = {
      // pedidos
      'ABERTA':       '#6c757d', // Cinza
      'ORÇADA':       '#795548', // Marrom
      'ORCADA':       '#795548', // (catálogo atual)
      'REJEITADA':    '#dc3545', // Vermelho
      'APROVADA':     '#ffc107', // Amarelo
      'REDIRECIONADA':'#6f42c1', // Roxo
      'ARRUMADA':     '#0d6efd', // Azul
      'PAGA':         '#fd7e14', // Alaranjado
      'FINALIZADA':   '#198754', // Verde
      // catálogo atual “equivalências”
      'CRIADA':       '#6c757d', // Cinza (ABERTA)
      'EM_EXEC':      '#6f42c1', // usar Roxo p/ “em execução / redirecionada”
      'CONCLUIDA':    '#198754', // Verde (FINALIZADA)
    };
    const bg = map[c] ?? '#6c757d';
    const fg = this.contraste(bg);
    return {
      display: 'inline-block',
      padding: '.2rem .5rem',
      borderRadius: '999px',
      background: bg,
      color: fg,
      fontSize: '.85rem',
      fontWeight: '600',
    };
  }

  private contraste(bgHex: string): string {
    // contraste simples: luminância do hex
    const rgb = bgHex.replace('#','');
    const r = parseInt(rgb.substring(0,2),16);
    const g = parseInt(rgb.substring(2,4),16);
    const b = parseInt(rgb.substring(4,6),16);
    const yiq = (r*299 + g*587 + b*114) / 1000;
    return yiq >= 128 ? '#111' : '#fff';
  }

  // Ações por status
  acao(item: ViewItem): { label: string; link: any[] } | null {
    const code = item.statusCodigo.toUpperCase();
    if (code === 'CRIADA' || code === 'ABERTA') {
      return { label: 'Efetuar Orçamento', link: ['/efetuar-orcamento', item.id] }; // RF012
    }
    if (code === 'APROVADA' || code === 'REDIRECIONADA') {
      return { label: 'Efetuar Manutenção', link: ['/efetuar-manutencao', item.id] }; // RF014
    }
    if (code === 'PAGA') {
      return { label: 'Finalizar Solicitação', link: ['/finalizar-solicitacao', item.id] }; // RF016
    }
    return null;
  }

  trackById = (_: number, i: ViewItem) => i.id;
}
