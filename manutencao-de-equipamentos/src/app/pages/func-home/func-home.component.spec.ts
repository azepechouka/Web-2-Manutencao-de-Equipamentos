import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncHomeComponent } from './func-home.component';

describe('FuncHomeComponent', () => {
  let component: FuncHomeComponent;
  let fixture: ComponentFixture<FuncHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
