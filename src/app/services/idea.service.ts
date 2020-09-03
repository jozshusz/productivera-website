import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {

  ideaList: any;
  private baseUrl = "http://www.prodbackend.com/api/";

  constructor(private http: HttpClient) { }

  getIdeas() {
    return this.http.get(this.baseUrl + "ideas");
  }
  
  createNewIdea(data) {
    return this.http.post(this.baseUrl + "createIdea", data);
  }

  createNewIdeaWithPic(form, header) {
    return this.http.post(this.baseUrl + "createIdeaWithPic", form, {
      headers: header
    });
  }
  
  upvote(data) {
    return this.http.post(this.baseUrl + "upvoteIdea", data);
  }
  
  deleteIdeaByAdmin(data) {
    return this.http.post(this.baseUrl + "deleteIdeaByAdmin", data);
  }

  getIdeasByUrl(url){
    return this.http.get(url);
  }
}
