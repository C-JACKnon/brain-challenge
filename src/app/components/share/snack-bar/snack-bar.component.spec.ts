import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackBarComponent, SnackBarData } from './snack-bar.component';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

describe('SnackBarComponent', () => {
  let component: SnackBarComponent;
  let fixture: ComponentFixture<SnackBarComponent>;
  let snackBarRefSpy: jasmine.SpyObj<MatSnackBarRef<MatSnackBar>>;
  let data: SnackBarData = {
    message: '',
    buttonText: '',
  };

  beforeEach(async () => {
    snackBarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['dismissWithAction']);
    await TestBed.configureTestingModule({
      imports: [SnackBarComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: snackBarRefSpy },
        { provide: MAT_SNACK_BAR_DATA, useValue: data },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
