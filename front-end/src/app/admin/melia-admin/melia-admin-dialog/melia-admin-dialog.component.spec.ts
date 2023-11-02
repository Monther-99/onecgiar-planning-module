import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeliaAdminDialogComponent } from './melia-admin-dialog.component';

describe('MeliaAdminDialogComponent', () => {
  let component: MeliaAdminDialogComponent;
  let fixture: ComponentFixture<MeliaAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeliaAdminDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeliaAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
