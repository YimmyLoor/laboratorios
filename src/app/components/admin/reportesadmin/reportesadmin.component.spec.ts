import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesadminComponent } from './reportesadmin.component';

describe('ReportesadminComponent', () => {
  let component: ReportesadminComponent;
  let fixture: ComponentFixture<ReportesadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
