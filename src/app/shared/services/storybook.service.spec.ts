import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { StorybookService } from './storybook.service';

describe('StorybookService', () => {
  let service: StorybookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(StorybookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
