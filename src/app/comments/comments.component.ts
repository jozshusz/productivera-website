import { Component, OnInit } from '@angular/core';
import { CommentService } from '../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  commentList = null;
  ideaPostId = null;
  isLoggedIn = false;
  idea = null;
  newComment = false;
  newCommentForm: FormGroup;
  submitted = false;
  token = null;

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.newCommentForm = this.formBuilder.group({
      commentText: ['', Validators.required],
      ideaId: ['', Validators.required],
      token: null
    });
    this.route.paramMap.subscribe( paramMap => {
      this.ideaPostId = paramMap.get('ideaId');
      this.initComments();
      this.isLoggedIn = this.tokenService.loggedIn();
      this.token = {
        'token': this.tokenService.get()
      };
    });
  }

  initComments(){
    this.commentService.getComments(this.ideaPostId).subscribe(
      data => {
        this.idea = data['idea'][0];
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
    this.newCommentForm.controls['ideaId'].setValue(this.ideaPostId);
    this.commentService.createNewComment(this.newCommentForm.value)
      .subscribe((res: any) => {
        var toInsert = res['comment'];
        toInsert['user'] = res['user'];
        this.commentList.unshift(res['comment']);

        this.newCommentForm.controls["ideaId"].setValue("");
        this.newCommentForm.controls["commentText"].setValue("");
        this.newCommentButton();
      }, error => {
        console.error(error);
      });
  }

  get f() { return this.newCommentForm.controls; }
}
