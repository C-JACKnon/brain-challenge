import { TestBed } from '@angular/core/testing';

import { MakeTenNotificationService } from './make-ten-notification.service';

describe('MakeTenNotificationService', () => {
  let service: MakeTenNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakeTenNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
