import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgNotiService {

  private baseUrl = "http://www.prodbackend.com/api/";

  newMsgNoti = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  checkForNotiMsg(data){
    this.http.post(this.baseUrl + "checkNotiMsg", data).subscribe(
      res => {
          this.newMsgNoti.next(res['needNotification']);
      },
      error=>{
        console.log(error);
      }
    );
  }

  notifyOwner(data){
    return this.http.post(this.baseUrl + "notifyOwner", data);
  }
  
  notifyUserPostOwner(data){
    return this.http.post(this.baseUrl + "notifyUserPostOwner", data);
  }
  
  setOpenMsgNoti(data){
    return this.http.post(this.baseUrl + 'openMsgNoti', data);
  }
}
