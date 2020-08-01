/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OthersProfileService } from './others-profile.service';

describe('Service: OthersProfile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OthersProfileService]
    });
  });

  it('should ...', inject([OthersProfileService], (service: OthersProfileService) => {
    expect(service).toBeTruthy();
  }));
});
