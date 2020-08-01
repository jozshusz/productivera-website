import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profileInfo: any;
  private baseUrl = "http://www.prodbackend.com/api/";

  constructor(private http: HttpClient) { }

  getOwnProfile(data){
    return this.http.post(this.baseUrl + "ownProfile", data);
  }

}
