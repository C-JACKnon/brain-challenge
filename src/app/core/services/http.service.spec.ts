import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

describe('HttpService', () => {
  let service: HttpService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('httpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ]
    });
    service = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
