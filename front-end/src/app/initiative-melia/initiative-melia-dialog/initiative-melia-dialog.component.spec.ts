import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeMeliaDialogComponent } from './initiative-melia-dialog.component';

describe('InitiativeMeliaDialogComponent', () => {
  let component: InitiativeMeliaDialogComponent;
  let fixture: ComponentFixture<InitiativeMeliaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativeMeliaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiativeMeliaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
