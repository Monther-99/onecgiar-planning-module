import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitedVersionViewComponent } from './submited-version-view.component';

describe('SubmitedVersionViewComponent', () => {
  let component: SubmitedVersionViewComponent;
  let fixture: ComponentFixture<SubmitedVersionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitedVersionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitedVersionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
