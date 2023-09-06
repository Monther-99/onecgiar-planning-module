import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterStatusComponent } from './center-status.component';

describe('CenterStatusComponent', () => {
  let component: CenterStatusComponent;
  let fixture: ComponentFixture<CenterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
