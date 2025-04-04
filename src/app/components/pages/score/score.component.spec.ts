import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreComponent } from './score.component';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon';
import { Component } from '@angular/core';
import { OnlineScoreComponent } from './unique-components/online-score/online-score.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'online-score',
  standalone: true,
  template: '',
})
class OnlineScoreComponentStub {}

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;
  let changeComponentServiceSpy: jasmine.SpyObj<ChangeComponentService>;

  beforeEach(async () => {
    changeComponentServiceSpy = jasmine.createSpyObj('ChangeComponentService', ['changePage']);
    await TestBed.configureTestingModule({
      imports: [
        ScoreComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ChangeComponentService, useValue: changeComponentServiceSpy },
        SvgIconRegistryService,
        SvgLoader,
      ]
    })
    .overrideComponent(ScoreComponent,
      {
        remove: {
          imports: [OnlineScoreComponent]
        },
        add: {
          imports: [OnlineScoreComponentStub]
        }
      }
    )
    .compileComponents();

    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
