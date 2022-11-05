import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarlaboratoriosadminComponent } from './configurarlaboratoriosadmin.component';

describe('ConfigurarlaboratoriosadminComponent', () => {
  let component: ConfigurarlaboratoriosadminComponent;
  let fixture: ComponentFixture<ConfigurarlaboratoriosadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurarlaboratoriosadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarlaboratoriosadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
