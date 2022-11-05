import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanneradminComponent } from './banneradmin.component';

describe('BanneradminComponent', () => {
  let component: BanneradminComponent;
  let fixture: ComponentFixture<BanneradminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanneradminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanneradminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
