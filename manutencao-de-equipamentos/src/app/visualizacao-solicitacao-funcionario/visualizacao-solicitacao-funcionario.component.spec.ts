import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoSolicitacaoFuncionarioComponent } from './visualizacao-solicitacao-funcionario.component';

describe('VisualizacaoSolicitacaoFuncionarioComponent', () => {
  let component: VisualizacaoSolicitacaoFuncionarioComponent;
  let fixture: ComponentFixture<VisualizacaoSolicitacaoFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizacaoSolicitacaoFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizacaoSolicitacaoFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
