import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = "https://api.productivera.com/api/";

  constructor(private http: HttpClient) { }
  
  sendMessage(data) {
    return this.http.post(this.baseUrl + "sendMessage", data);
  }
}
