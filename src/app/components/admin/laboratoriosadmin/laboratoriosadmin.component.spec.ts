import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoriosadminComponent } from './laboratoriosadmin.component';

describe('LaboratoriosadminComponent', () => {
  let component: LaboratoriosadminComponent;
  let fixture: ComponentFixture<LaboratoriosadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaboratoriosadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratoriosadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
