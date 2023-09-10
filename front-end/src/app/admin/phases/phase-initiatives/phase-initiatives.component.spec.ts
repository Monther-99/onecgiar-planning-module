import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseInitiativesComponent } from './phase-initiatives.component';

describe('PhaseInitiativesComponent', () => {
  let component: PhaseInitiativesComponent;
  let fixture: ComponentFixture<PhaseInitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseInitiativesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
