import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeMeliaComponent } from './initiative-melia.component';

describe('InitiativeMeliaComponent', () => {
  let component: InitiativeMeliaComponent;
  let fixture: ComponentFixture<InitiativeMeliaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativeMeliaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiativeMeliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
