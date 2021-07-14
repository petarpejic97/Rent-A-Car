import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarSuccSignUpComponent } from './snack-bar-succ-sign-up.component';

describe('SnackBarSuccSignUpComponent', () => {
  let component: SnackBarSuccSignUpComponent;
  let fixture: ComponentFixture<SnackBarSuccSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackBarSuccSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarSuccSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
