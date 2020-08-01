/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AfterLoginService } from './after-login.service';

describe('Service: AfterLogin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AfterLoginService]
    });
  });

  it('should ...', inject([AfterLoginService], (service: AfterLoginService) => {
    expect(service).toBeTruthy();
  }));
});
