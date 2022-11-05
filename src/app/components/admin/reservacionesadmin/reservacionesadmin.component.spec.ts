import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionesadminComponent } from './reservacionesadmin.component';

describe('ReservacionesadminComponent', () => {
  let component: ReservacionesadminComponent;
  let fixture: ComponentFixture<ReservacionesadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservacionesadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservacionesadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
