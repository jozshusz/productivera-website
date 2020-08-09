import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl = "http://www.prodbackend.com/api/";

  constructor(private http: HttpClient) { }

  getIdeaSearchResults(data) {
    return this.http.get(this.baseUrl + "getIdeaSearchResults/" + data);
  }
  
  getUserPostSearchResults(data) {
    return this.http.get(this.baseUrl + "getUserPostSearchResults/" + data);
  }

}
