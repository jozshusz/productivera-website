/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PostCommentService } from './post-comment.service';

describe('Service: PostComment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostCommentService]
    });
  });

  it('should ...', inject([PostCommentService], (service: PostCommentService) => {
    expect(service).toBeTruthy();
  }));
});
