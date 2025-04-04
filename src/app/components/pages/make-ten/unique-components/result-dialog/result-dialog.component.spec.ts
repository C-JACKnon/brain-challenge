import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultDialogComponent } from './result-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon';

describe('ResultDialogComponent', () => {
  let component: ResultDialogComponent;
  let fixture: ComponentFixture<ResultDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ResultDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [ResultDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        SvgIconRegistryService,
        SvgLoader,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
