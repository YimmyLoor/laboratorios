import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesencargadoComponent } from './materialesencargado.component';

describe('MaterialesencargadoComponent', () => {
  let component: MaterialesencargadoComponent;
  let fixture: ComponentFixture<MaterialesencargadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialesencargadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesencargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
