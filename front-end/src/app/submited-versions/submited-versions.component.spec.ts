import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitedVersionsComponent } from './submited-versions.component';

describe('SubmitedVersionsComponent', () => {
  let component: SubmitedVersionsComponent;
  let fixture: ComponentFixture<SubmitedVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitedVersionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitedVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
