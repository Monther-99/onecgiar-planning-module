import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitedVersionComponent } from './submited-version.component';

describe('SubmitedVersionComponent', () => {
  let component: SubmitedVersionComponent;
  let fixture: ComponentFixture<SubmitedVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitedVersionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitedVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
