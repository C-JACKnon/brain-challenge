import { TestBed } from '@angular/core/testing';

import { ChangeComponentService } from './change-component.service';

describe('ChangeComponentService', () => {
  let service: ChangeComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
