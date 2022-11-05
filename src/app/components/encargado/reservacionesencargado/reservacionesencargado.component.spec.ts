import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionesencargadoComponent } from './reservacionesencargado.component';

describe('ReservacionesencargadoComponent', () => {
  let component: ReservacionesencargadoComponent;
  let fixture: ComponentFixture<ReservacionesencargadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservacionesencargadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservacionesencargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
