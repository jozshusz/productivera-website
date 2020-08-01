import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  commentList: any;
  private baseUrl = "http://www.prodbackend.com/api/";

  constructor(private http: HttpClient) { }

  getComments(ideaPostId) {
    return this.http.get(this.baseUrl + "comments/" + ideaPostId);
  }

  createNewComment(data) {
    return this.http.post(this.baseUrl + "createComment", data);
  }

}
