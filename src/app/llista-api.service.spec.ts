import { TestBed } from '@angular/core/testing';

import { LlistaApiService } from './llista-api.service';

describe('LlistaApiService', () => {
  let service: LlistaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlistaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
