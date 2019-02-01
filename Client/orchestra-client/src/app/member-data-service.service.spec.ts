import { TestBed } from '@angular/core/testing';

import { MemberDataServiceService } from './member-data-service.service';

describe('MemberDataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemberDataServiceService = TestBed.get(MemberDataServiceService);
    expect(service).toBeTruthy();
  });
});
