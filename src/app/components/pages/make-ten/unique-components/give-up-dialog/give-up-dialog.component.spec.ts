import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GiveUpDialogComponent } from './give-up-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon';

describe('GiveUpDialogComponent', () => {
  let component: GiveUpDialogComponent;
  let fixture: ComponentFixture<GiveUpDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<GiveUpDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [GiveUpDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        SvgIconRegistryService,
        SvgLoader,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
