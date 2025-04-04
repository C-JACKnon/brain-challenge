import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineScoreComponent } from './online-score.component';
import { StorageService } from '../../../../../core/services/storage.service';
import { HttpService } from '../../../../../core/services/http.service';
import { of } from 'rxjs';

describe('OnlineScoreComponent', () => {
  let component: OnlineScoreComponent;
  let fixture: ComponentFixture<OnlineScoreComponent>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(async () => {
    storageServiceSpy = jasmine.createSpyObj(
      'StorageService',
      [
        'removeMuteList',
        'addMuteList'
      ],
      {
        muteList: []
      }
    );
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['getOnlineScore']);
    httpServiceSpy.getOnlineScore.and.returnValue(of());
    await TestBed.configureTestingModule({
      imports: [OnlineScoreComponent],
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: HttpService, useValue: httpServiceSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
