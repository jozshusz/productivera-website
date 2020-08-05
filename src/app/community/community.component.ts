import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../services/community.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  postList = null;
  newPostForm: FormGroup;
  submitted = false;
  token = null;
  userId = null;
  newPost = false;
  isLoggedIn = false;
  adminOrMod = false;

  constructor(
    private communityService: CommunityService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.newPostForm = this.formBuilder.group({
      postText: ['', Validators.required],
      postCategory: ['', Validators.required],
      token: null
    });

    this.token = {
      'token': this.tokenService.get()
    };
    this.userId = this.tokenService.getUserId();

    this.initPosts();
    this.isLoggedIn = this.tokenService.loggedIn();
    
    // check if user is logged in
    if(this.isLoggedIn){
      this.userId = this.tokenService.getUserId();
      if(this.tokenService.getUserStatus() == 'admin' || this.tokenService.getUserStatus() == 'mod'){
        this.adminOrMod = true;
      }
    }
  }

  initPosts(){
    this.communityService.getPosts()
      .subscribe((res: any) => {
        this.postList = res["data"];
      }, error => {
        console.error(error);
      });
  }
  
  onSubmit(){
    this.submitted = true;
    this.newPostForm.controls['token'].setValue(this.token['token']);
    this.communityService.createNewPost(this.newPostForm.value)
      .subscribe((res: any) => {
        this.handlePostCreatedResponse(res);
      }, error => {
        console.error(error);
      });
  }

  get f() { return this.newPostForm.controls; }
  
  newPostButton(){
    this.newPost = !this.newPost;
  }

  handlePostCreatedResponse(res){
    var toInsert = res['post'];
    toInsert['user'] = res['user'];
    this.postList.unshift(toInsert);

    this.newPostForm.controls["postText"].setValue("");
    this.newPostForm.controls["postCategory"].setValue("");
    this.newPostButton();
    this.submitted = false;

    setTimeout( () => { document.getElementById(res['post'].id).scrollIntoView({ block: 'center',  behavior: 'smooth' }); }, 1000 );
  }

  // admin/mod delete
  deletePost(postId, userId){
    document.getElementById("closeButton-" + postId).click();
    this.communityService.deleteUserPostByAdmin({
      "postId": postId,
      "token": this.token['token'],
      "userId": userId
    }).subscribe(
      data => {
        this.postList = this.postList.filter(({ id }) => id !== postId); 
      },
      error => {
        console.log('Error while deleting post');
      }
    );
  }

}
