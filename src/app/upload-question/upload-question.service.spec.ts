import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { UploadQuestionService } from './upload-question.service';

describe('UploadQuestionService', () => {
  let service: UploadQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(UploadQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
