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

  getIdeasByUser(data) {
    return this.http.get(this.baseUrl + "getIdeasByUser/" + data);
  }

  getUserPostsByUser(data) {
    return this.http.get(this.baseUrl + "getUserPostsByUser/" + data);
  }

  getIdeasByCategory(data) {
    return this.http.get(this.baseUrl + "getIdeasByCategory/" + data);
  }
  
  getUserPostsByCategory(data) {
    return this.http.get(this.baseUrl + "getUserPostsByCategory/" + data);
  }
  
}
