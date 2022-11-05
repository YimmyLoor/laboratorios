import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasadminComponent } from './carrerasadmin.component';

describe('CarrerasadminComponent', () => {
  let component: CarrerasadminComponent;
  let fixture: ComponentFixture<CarrerasadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrerasadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrerasadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
