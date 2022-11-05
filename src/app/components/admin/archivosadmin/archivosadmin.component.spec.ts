import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosadminComponent } from './archivosadmin.component';

describe('ArchivosadminComponent', () => {
  let component: ArchivosadminComponent;
  let fixture: ComponentFixture<ArchivosadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivosadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
