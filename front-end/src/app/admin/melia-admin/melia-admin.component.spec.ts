import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeliaAdminComponent } from './melia-admin.component';

describe('MeliaAdminComponent', () => {
  let component: MeliaAdminComponent;
  let fixture: ComponentFixture<MeliaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeliaAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeliaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
