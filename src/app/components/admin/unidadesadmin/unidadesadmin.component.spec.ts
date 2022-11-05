import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesadminComponent } from './unidadesadmin.component';

describe('UnidadesadminComponent', () => {
  let component: UnidadesadminComponent;
  let fixture: ComponentFixture<UnidadesadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadesadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
