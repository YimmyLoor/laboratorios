import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesadminComponent } from './rolesadmin.component';

describe('RolesadminComponent', () => {
  let component: RolesadminComponent;
  let fixture: ComponentFixture<RolesadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
