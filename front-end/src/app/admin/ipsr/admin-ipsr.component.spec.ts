import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIpsrComponent } from './admin-ipsr.component';

describe('AdminIpsrComponent', () => {
  let component: AdminIpsrComponent;
  let fixture: ComponentFixture<AdminIpsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminIpsrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIpsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
