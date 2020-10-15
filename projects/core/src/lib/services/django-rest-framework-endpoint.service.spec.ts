import { TestBed } from '@angular/core/testing';

import { DjangoRestFrameworkEndpointService } from './django-rest-framework-endpoint.service';

describe('DjangoRestFrameworkEndpointService', () => {
  let service: DjangoRestFrameworkEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DjangoRestFrameworkEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
