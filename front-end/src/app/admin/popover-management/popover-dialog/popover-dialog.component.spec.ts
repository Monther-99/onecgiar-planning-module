import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverDialogComponent } from './popover-dialog.component';

describe('PopoverDialogComponent', () => {
  let component: PopoverDialogComponent;
  let fixture: ComponentFixture<PopoverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopoverDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
