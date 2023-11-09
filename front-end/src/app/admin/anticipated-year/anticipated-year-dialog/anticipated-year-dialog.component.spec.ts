import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticipatedYearDialogComponent } from './anticipated-year-dialog.component';

describe('AnticipatedYearDialogComponent', () => {
  let component: AnticipatedYearDialogComponent;
  let fixture: ComponentFixture<AnticipatedYearDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnticipatedYearDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnticipatedYearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
