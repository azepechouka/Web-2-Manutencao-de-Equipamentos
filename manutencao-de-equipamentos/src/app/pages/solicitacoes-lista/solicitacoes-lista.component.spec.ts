import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesListaComponent } from './solicitacoes-lista.component';

describe('SolicitacoesListaComponent', () => {
  let component: SolicitacoesListaComponent;
  let fixture: ComponentFixture<SolicitacoesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacoesListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
