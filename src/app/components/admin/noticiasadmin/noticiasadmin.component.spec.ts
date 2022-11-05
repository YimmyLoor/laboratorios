import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasadminComponent } from './noticiasadmin.component';

describe('NoticiasadminComponent', () => {
  let component: NoticiasadminComponent;
  let fixture: ComponentFixture<NoticiasadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticiasadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiasadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
