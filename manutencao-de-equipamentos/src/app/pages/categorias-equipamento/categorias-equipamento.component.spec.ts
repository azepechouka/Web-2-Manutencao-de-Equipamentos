import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasEquipamentoComponent } from './categorias-equipamento.component';

describe('CategoriasEquipamentoComponent', () => {
  let component: CategoriasEquipamentoComponent;
  let fixture: ComponentFixture<CategoriasEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasEquipamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasEquipamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
