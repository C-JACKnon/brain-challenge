import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeTenComponent } from './make-ten.component';

describe('MakeTenComponent', () => {
  let component: MakeTenComponent;
  let fixture: ComponentFixture<MakeTenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeTenComponent]
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
