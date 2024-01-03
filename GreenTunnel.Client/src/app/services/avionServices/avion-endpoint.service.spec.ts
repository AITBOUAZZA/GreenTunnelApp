import { TestBed } from '@angular/core/testing';

import { AvionEndpointService } from './avion-endpoint.service';

describe('AvionEndpointService', () => {
  let service: AvionEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvionEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
