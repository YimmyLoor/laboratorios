import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginrolComponent } from './loginrol.component';

describe('LoginrolComponent', () => {
  let component: LoginrolComponent;
  let fixture: ComponentFixture<LoginrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginrolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
