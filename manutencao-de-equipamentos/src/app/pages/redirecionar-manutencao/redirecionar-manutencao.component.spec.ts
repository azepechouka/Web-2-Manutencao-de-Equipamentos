import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirecionarManutencaoComponent } from './redirecionar-manutencao.component';

describe('RedirecionarManutencaoComponent', () => {
  let component: RedirecionarManutencaoComponent;
  let fixture: ComponentFixture<RedirecionarManutencaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirecionarManutencaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirecionarManutencaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
