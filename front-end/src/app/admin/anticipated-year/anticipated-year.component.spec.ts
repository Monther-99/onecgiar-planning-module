import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticipatedYearComponent } from './anticipated-year.component';

describe('AnticipatedYearComponent', () => {
  let component: AnticipatedYearComponent;
  let fixture: ComponentFixture<AnticipatedYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnticipatedYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnticipatedYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
