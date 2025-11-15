import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioCategoriaComponent } from './relatorio-categorias.component';

describe('RelatorioCategoriasComponent', () => {
  let component: RelatorioCategoriaComponent;
  let fixture: ComponentFixture<RelatorioCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
