import { TestBed } from '@angular/core/testing';

import { VisitorProfileService } from './visitor-profile.service';

describe('VisitorProfileService', () => {
  let service: VisitorProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitorProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
