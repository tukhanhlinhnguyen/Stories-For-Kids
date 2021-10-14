import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { PostjsonService } from './postjson.service';

describe('PostjsonService', () => {
  let service: PostjsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(PostjsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
