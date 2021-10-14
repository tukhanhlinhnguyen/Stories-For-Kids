import { TestBed } from '@angular/core/testing';

import { AvatarCreationService } from './avatar-creation.service';

describe('AvatarCreationService', () => {
  let service: AvatarCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
