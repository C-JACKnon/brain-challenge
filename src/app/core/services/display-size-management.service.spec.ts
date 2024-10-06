import { TestBed } from '@angular/core/testing';

import { DisplaySizeManagementService } from './display-size-management.service';

describe('DisplaySizeManagementService', () => {
  let service: DisplaySizeManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplaySizeManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
