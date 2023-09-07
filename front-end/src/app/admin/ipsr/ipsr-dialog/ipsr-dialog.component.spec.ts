import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpsrDialogComponent } from './ipsr-dialog.component';

describe('IpsrDialogComponent', () => {
  let component: IpsrDialogComponent;
  let fixture: ComponentFixture<IpsrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpsrDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpsrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
