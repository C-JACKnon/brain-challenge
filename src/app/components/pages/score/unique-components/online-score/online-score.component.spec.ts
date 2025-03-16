import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineScoreComponent } from './online-score.component';

describe('OnlineScoreComponent', () => {
  let component: OnlineScoreComponent;
  let fixture: ComponentFixture<OnlineScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineScoreComponent]
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
