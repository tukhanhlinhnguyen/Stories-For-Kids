import { TestBed } from '@angular/core/testing';

import { LevelUpService } from './level-up.service';

describe('LevelUpService', () => {
  let service: LevelUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
