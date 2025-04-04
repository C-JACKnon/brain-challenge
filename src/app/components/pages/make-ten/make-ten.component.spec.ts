import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MakeTenComponent } from './make-ten.component';
import { HttpService } from '../../../core/services/http.service';
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon';

describe('MakeTenComponent', () => {
  let component: MakeTenComponent;
  let fixture: ComponentFixture<MakeTenComponent>;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(async () => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['postScore']);
    await TestBed.configureTestingModule({
      imports: [MakeTenComponent],
      providers: [
        { provide: HttpService, useValue: httpServiceSpy },
        SvgIconRegistryService,
        SvgLoader,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeTenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
