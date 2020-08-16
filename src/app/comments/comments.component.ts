import { Component, OnInit } from '@angular/core';
import { CommentService } from '../services/comment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { MsgNotiService } from '../services/msg-noti.service';

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
  userId = null;
  commentUrlParam = null;
  notScrolled = true;
  adminOrMod = false;
  tooManyCharComment = false;
  loading = false;
  paginatorData = null;

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private msgNotiService: MsgNotiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.newCommentForm = this.formBuilder.group({
      commentText: ['', Validators.required],
      ideaId: ['', Validators.required],
      token: null
    });
    this.route.paramMap.subscribe( paramMap => {
      this.commentUrlParam = paramMap.get('comment');
      this.ideaPostId = paramMap.get('ideaId');
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
  }

  initComments(){
    this.commentService.getComments(this.ideaPostId).subscribe(
      data => {
        this.idea = data['idea'][0];
        this.paginatorData = data['comments'];
        this.commentList = data['comments'].data;
      },
      error => console.log(error)
    );
  }

  newCommentButton(){
    if(this.isLoggedIn){
      this.newComment = !this.newComment;
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  onSubmit(){
    if(this.newCommentForm.value["commentText"].length < 301){
      this.loading = true;
      this.tooManyCharComment = false;
      this.submitted = true;
      this.newCommentForm.controls['token'].setValue(this.token['token']);
      this.newCommentForm.controls['ideaId'].setValue(this.ideaPostId);
      this.commentService.createNewComment(this.newCommentForm.value)
        .subscribe((res: any) => {
          this.loading = false;
          
          if(this.commentList.length > 11){
            this.byPageNumber(this.paginatorData["first_page_url"]);
          }else{
            var toInsert = res['comment'];
            toInsert['user'] = res['user'];
            this.commentList.unshift(res['comment']);
          }

          this.newCommentForm.controls["ideaId"].setValue("");
          this.newCommentForm.controls["commentText"].setValue("");
          this.newCommentButton();
          this.submitted = false;
          this.idea.comments_count += 1;

          if(this.idea.user_id != this.userId){
            // send notifications to the owner of the idea post 
            // only if the owner is not the one sending the comment
            this.msgNotiService.notifyOwner({
              'token': this.tokenService.get(),
              'ideaId': this.idea.id,
              'commentId': res['comment'].id
            }).subscribe(
              data => console.log('Comment sent'),
              error => console.log(error)
            );
          }
        }, error => {
          console.error(error);
        });
    }else{
      this.tooManyCharComment = true;
    }
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
    this.commentService.deleteCommentByAdmin({
      "commentId": commentId,
      "token": this.token['token'],
      "ideaId": this.idea.id
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

  // paginator 
  prevPage() {
    this.commentService.getCommentsByUrl(this.paginatorData.prev_page_url).subscribe(
      data => {
        this.paginatorData = data['comments'];
        this.commentList = data['comments'].data;
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }

  nextPage() {
    this.commentService.getCommentsByUrl(this.paginatorData.next_page_url).subscribe(
      data => {
        this.paginatorData = data['comments'];
        this.commentList = data['comments'].data;
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }

  byPageNumber(pageNumber) {
    let url = this.paginatorData["path"] + "?page=" + pageNumber;
    this.commentService.getCommentsByUrl(url).subscribe(
      data => {
        this.paginatorData = data['comments'];
        this.commentList = data['comments'].data;
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }
}
