import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../services/community.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';

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

  submittedSearch = false;
  searchForm: FormGroup;

  paginatorData = null;
  tooManyCharDescription = false;
  loading = false;
  searchLoading = false;
  
  checkbox = {
    'general': true,
    'book': false,
    'web': false,
    'programming': false,
    'marketing': false,
    'advertising': false,
    'content': false,
    'blog': false,
    'design': false,
    'event': false,
    'platform': false,
    'education': false,
    'finance': false,
    'health': false,
    'entertainment': false,
    'sales': false,
    'other': false,
  };

  constructor(
    private communityService: CommunityService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private searchService: SearchService,
    private router: Router
  ) { }

  ngOnInit() {
    this.newPostForm = this.formBuilder.group({
      postText: ['', Validators.required],
      token: null,
      categories: null
    });

    this.searchForm = this.formBuilder.group({
      searchInput: ['', Validators.required]
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
        this.paginatorData = res;
        this.postList = res["data"];
      }, error => {
        console.error(error);
      });
  }
  
  onSubmit(){
    if(this.newPostForm.value["postText"].length < 301){
      this.loading = true;
      this.tooManyCharDescription = false;
      this.submitted = true;
      this.newPostForm.controls['token'].setValue(this.token['token']);
      this.newPostForm.controls['categories'].setValue(JSON.stringify(this.checkbox));
      this.communityService.createNewPost(this.newPostForm.value)
        .subscribe((res: any) => {
          this.handlePostCreatedResponse(res);
        }, error => {
          console.error(error);
        });
    }else{
      this.tooManyCharDescription = true;
    }
  }

  get f() { return this.newPostForm.controls; }
  
  newPostButton(){
    if(this.isLoggedIn){
      this.newPost = !this.newPost;
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  handlePostCreatedResponse(res){
    this.loading = false;
    if(this.postList.length > 11){
      this.byPageNumber(this.paginatorData["first_page_url"]);
    }else{
      var toInsert = res['post'];
      toInsert['user'] = res['user'];
      toInsert['categories'] = res['categories'];
      toInsert['comments_count'] = 0;
      this.postList.unshift(toInsert);
    }

    this.newPostForm.controls["postText"].setValue("");
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

  // to submit search
  searchSubmit(){
    if(this.searchForm.value["searchInput"].trim()){
      this.searchLoading = true;
      this.searchService.getUserPostSearchResults(this.searchForm.value["searchInput"].trim()).subscribe(
        data => {
          this.paginatorData = data;
          this.postList = data['data'];
          this.searchLoading = false;
        },
        error => console.log(error)
      );
    }
  }

  // paginator 
  prevPage() {
    this.communityService.getPostsByUrl(this.paginatorData.prev_page_url).subscribe(
      data => {
        this.paginatorData = data;
        this.postList = data["data"];
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }

  nextPage() {
    this.communityService.getPostsByUrl(this.paginatorData.next_page_url).subscribe(
      data => {
        this.paginatorData = data;
        this.postList = data["data"];
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }

  byPageNumber(pageNumber) {
    let url = this.paginatorData["path"] + "?page=" + pageNumber;
    this.communityService.getPostsByUrl(url).subscribe(
      data => {
        this.paginatorData = data;
        this.postList = data["data"];
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }
}
