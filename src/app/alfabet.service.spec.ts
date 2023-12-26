import { TestBed } from '@angular/core/testing';

import { AlfabetService } from './alfabet.service';

describe('AlfabetService', () => {
  let service: AlfabetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlfabetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
