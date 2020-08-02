import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../services/token.service';
import { PostCommentService } from '../services/post-comment.service';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit {

  commentList = null;
  postId = null;
  isLoggedIn = false;
  post = null;

  newComment = false;
  newCommentForm: FormGroup;
  submitted = false;
  token = null;

  constructor(
    private formBuilder: FormBuilder,
    private postCommentService: PostCommentService,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.newCommentForm = this.formBuilder.group({
      commentText: ['', Validators.required],
      postId: ['', Validators.required],
      token: null
    });
    this.route.paramMap.subscribe( paramMap => {
      this.postId = paramMap.get('postId');
      this.initComments();
      this.isLoggedIn = this.tokenService.loggedIn();
      this.token = {
        'token': this.tokenService.get()
      };
    });
  }
  
  initComments(){
    this.postCommentService.getPostComments(this.postId).subscribe(
      data => {
        this.post = data['post'][0];
        this.commentList = data['comments'].data;
      },
      error => console.log(error)
    );
  }
  
  newCommentButton(){
    this.newComment = !this.newComment;
  }

  onSubmit(){
    this.submitted = true;
    this.newCommentForm.controls['token'].setValue(this.token['token']);
    this.newCommentForm.controls['postId'].setValue(this.postId);
    this.postCommentService.createNewPostComment(this.newCommentForm.value)
      .subscribe((res: any) => {
        var toInsert = res['comment'];
        toInsert['user'] = res['user'];
        this.commentList.unshift(res['comment']);

        this.newCommentForm.controls["postId"].setValue("");
        this.newCommentForm.controls["commentText"].setValue("");
        this.newCommentButton();
      }, error => {
        console.error(error);
      });
  }

  get f() { return this.newCommentForm.controls; }

}
