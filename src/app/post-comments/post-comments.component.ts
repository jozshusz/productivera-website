import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../services/token.service';
import { PostCommentService } from '../services/post-comment.service';
import { MsgNotiService } from '../services/msg-noti.service';

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
  userId = null;
  commentUrlParam = null;
  notScrolled = true;
  adminOrMod = false;

  constructor(
    private formBuilder: FormBuilder,
    private postCommentService: PostCommentService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private msgNotiService: MsgNotiService
  ) { }

  ngOnInit() {
    this.newCommentForm = this.formBuilder.group({
      commentText: ['', Validators.required],
      postId: ['', Validators.required],
      token: null
    });
    this.route.paramMap.subscribe( paramMap => {
      this.commentUrlParam = paramMap.get('comment');
      this.postId = paramMap.get('postId');
      this.initComments();
      this.isLoggedIn = this.tokenService.loggedIn();
      this.token = {
        'token': this.tokenService.get()
      };
      
      // check if user is logged in
      if(this.isLoggedIn){
        this.userId = this.tokenService.getUserId();
        if(this.tokenService.getUserStatus() == 'admin' || this.tokenService.getUserStatus() == 'mod'){
          this.adminOrMod = true;
        }
      }
    });

    this.userId = this.tokenService.getUserId();
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

        if(this.post.user_id != this.userId){
          // send notifications to the owner of the user post 
          // only if the owner is not the one sending the comment
          this.msgNotiService.notifyUserPostOwner({
            'token': this.tokenService.get(),
            'postId': this.post.id,
            'commentId': res['comment'].id
          }).subscribe(
            data => {
              this.submitted = false;
            },
            error => console.log(error)
          );
        }
      }, error => {
        console.error(error);
      });
  }

  get f() { return this.newCommentForm.controls; }
  
  // scroll only if the view is finished
  ngAfterViewChecked(){
    if(this.commentUrlParam && document.getElementById(this.commentUrlParam) && this.notScrolled){
      document.getElementById(this.commentUrlParam).scrollIntoView({ block: 'center',  behavior: 'smooth' });
      this.notScrolled = false;
    }
  }

  // admin/mod delete
  deleteComment(commentId){
    document.getElementById("closeButton-" + commentId).click();
    this.postCommentService.deletePostCommentByAdmin({
      "commentId": commentId,
      "token": this.token['token'],
      "userPostId": this.post.id
    }).subscribe(
      data => {
        console.log(data);
        this.commentList.filter(x => x.id == commentId)[0]['moderated'] = true;
        this.commentList.filter(x => x.id == commentId)[0]['text'] = data['text'];
      },
      error => {
        this.commentList.filter(x => x.id == commentId)[0]['modTryDeleteAdmin'] = true;
      }
    );
  }

}
