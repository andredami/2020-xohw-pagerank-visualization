import { TestBed } from '@angular/core/testing';

import { PagerankService } from './pagerank.service';

describe('PagerankService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagerankService = TestBed.get(PagerankService);
    expect(service).toBeTruthy();
  });
});
