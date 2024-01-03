import { TestBed } from '@angular/core/testing';

import { PiloteEndpointService } from './pilote-endpoint.service';

describe('PiloteEndpointService', () => {
  let service: PiloteEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PiloteEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
