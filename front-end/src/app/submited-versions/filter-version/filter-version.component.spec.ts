import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVersionComponent } from './filter-version.component';

describe('FilterVersionComponent', () => {
  let component: FilterVersionComponent;
  let fixture: ComponentFixture<FilterVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterVersionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
