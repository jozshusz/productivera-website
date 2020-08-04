/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MsgNotiService } from './msg-noti.service';

describe('Service: MsgNoti', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsgNotiService]
    });
  });

  it('should ...', inject([MsgNotiService], (service: MsgNotiService) => {
    expect(service).toBeTruthy();
  }));
});
