import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgatarServicoComponent } from './resgatar-servico.component';

describe('ResgatarServicoComponent', () => {
  let component: ResgatarServicoComponent;
  let fixture: ComponentFixture<ResgatarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResgatarServicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResgatarServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
