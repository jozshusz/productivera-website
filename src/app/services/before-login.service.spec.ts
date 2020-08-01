/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BeforeLoginService } from './before-login.service';

describe('Service: BeforeLogin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeforeLoginService]
    });
  });

  it('should ...', inject([BeforeLoginService], (service: BeforeLoginService) => {
    expect(service).toBeTruthy();
  }));
});
