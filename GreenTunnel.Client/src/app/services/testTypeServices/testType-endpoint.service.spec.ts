import { TestBed } from '@angular/core/testing';

import { TestTypeEndpointService } from './testType-endpoint.service';

describe('TestEndpointService', () => {
  let service: TestTypeEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestTypeEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
