import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallereservacionesdocenteComponent } from './detallereservacionesdocente.component';

describe('DetallereservacionesdocenteComponent', () => {
  let component: DetallereservacionesdocenteComponent;
  let fixture: ComponentFixture<DetallereservacionesdocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallereservacionesdocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallereservacionesdocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
