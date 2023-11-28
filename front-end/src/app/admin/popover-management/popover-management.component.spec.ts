import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverManagementComponent } from './popover-management.component';

describe('PopoverManagementComponent', () => {
  let component: PopoverManagementComponent;
  let fixture: ComponentFixture<PopoverManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopoverManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
