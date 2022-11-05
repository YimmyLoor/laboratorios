import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionesdocenteComponent } from './reservacionesdocente.component';

describe('ReservacionesdocenteComponent', () => {
  let component: ReservacionesdocenteComponent;
  let fixture: ComponentFixture<ReservacionesdocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservacionesdocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservacionesdocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
