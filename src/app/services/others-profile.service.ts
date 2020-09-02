import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OthersProfileService {

  private baseUrl = "http://www.prodbackend.com/api/";

  constructor(private http: HttpClient) { }

  getOthersProfile(profileId) {
    return this.http.get(this.baseUrl + "othersProfile/" + profileId);
  }
  
  banUser(data){
    return this.http.post(this.baseUrl + 'banUser', data);
  }

}
