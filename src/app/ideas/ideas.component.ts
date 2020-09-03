import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IdeaService } from '../services/idea.service';
import { ViewChild } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { SearchService } from '../services/search.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {

  newIdeaForm: FormGroup;
  submitted = false;
  ideaList = null;
  token = null;
  userId = null;
  isLoggedIn = false;
  adminOrMod = false;

  postNewIdea = false;
  selectedFile: File = null;

  @ViewChild('selectFileInput')
  selectFileInput: ElementRef;

  picResponseMessage = null;
  picErrorMessage = null;

  submittedSearch = false;
  searchForm: FormGroup;

  paginatorData = null;
  
  tooManyCharTitle = false;
  tooManyCharDescription = false;
  loading = false;
  searchLoading = false;
  onlyUserIdeas = null;
  categoryIdeas = null;
  picError = false;
  freshComments = null;

  //searchFilter = "ideaFilter";

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
    private formBuilder: FormBuilder,
    private ideaService: IdeaService,
    private tokenService: TokenService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private commentService: CommentService
    ) { }

  ngOnInit() {
    this.newIdeaForm = this.formBuilder.group({
      ideaTitle: ['', Validators.required],
      ideaDesc: ['', Validators.required],
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

    this.route.paramMap.subscribe( paramMap => {
      if(paramMap.get("byUser") != null){
        this.onlyUserIdeas = paramMap.get("byUser");
        this.initUsersIdeas();
      }else if(paramMap.get("byCategory") != null){
        this.categoryIdeas = paramMap.get("byCategory");
        this.initIdeasByCategory();
      }else{
        this.initIdeas();
      }
    });

    this.commentService.getFreshComments().subscribe((res: any) => {
      this.freshComments = res;
    }, error => {
      console.error(error);
    });

    this.isLoggedIn = this.tokenService.loggedIn();

    // check if user is logged in
    if(this.isLoggedIn){
      this.userId = this.tokenService.getUserId();
      if(this.tokenService.getUserStatus() == 'admin' || this.tokenService.getUserStatus() == 'mod'){
        this.adminOrMod = true;
      }
    }
  }

  initIdeas(){
    this.ideaService.getIdeas()
      .subscribe((res: any) => {
        this.paginatorData = res;
        this.ideaList = res["data"];
        this.checkUpvotedStatus();
      }, error => {
        console.error(error);
      });
  }

  initUsersIdeas(){
    this.searchService.getIdeasByUser(this.onlyUserIdeas)
      .subscribe((res: any) => {
        this.paginatorData = res;
        this.ideaList = res["data"];
        this.checkUpvotedStatus();
      }, error => {
        console.error(error);
      });
  }
  
  initIdeasByCategory(){
    this.searchService.getIdeasByCategory(this.categoryIdeas)
      .subscribe((res: any) => {
        this.paginatorData = res;
        this.ideaList = res["data"];
        this.checkUpvotedStatus();
      }, error => {
        console.error(error);
      });
  }

  onSubmit(){
    this.submitted = true;
  }

  get f() { return this.newIdeaForm.controls; }

  postNewIdeaButton(){
    if(this.isLoggedIn){
      this.postNewIdea = !this.postNewIdea;
      this.selectedFile = null;
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  // Upload idea pic
  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
  }

  createNewPostButton(){
    if(this.newIdeaForm.value["ideaTitle"].length < 51){
      this.tooManyCharTitle = false;
      if(this.newIdeaForm.value["ideaDesc"].length < 251){
        this.tooManyCharDescription = false;
        this.loading = true;
        if(this.selectedFile != null){
          const formData = new FormData();
          const headers = new HttpHeaders();
          headers.append('Content-Type', 'multipart/form-data');
          headers.append('Accept', 'application/json');
          formData.append('image', this.selectedFile);
          formData.append('ideaTitle', this.newIdeaForm.value['ideaTitle']);
          formData.append('ideaDesc', this.newIdeaForm.value['ideaDesc']);
          formData.append('categories', JSON.stringify(this.checkbox));
          formData.append('token', this.token['token']);
          this.ideaService.createNewIdeaWithPic(formData, headers)
            .subscribe((res: any) => {
              this.handleIdeaCreatedResponse(res);
            }, error => {
              console.error(error);
              this.loading = false;
              this.picError = true;
            });
        }else{
          this.newIdeaForm.controls['token'].setValue(this.token['token']);
          this.newIdeaForm.controls['categories'].setValue(JSON.stringify(this.checkbox));
          this.ideaService.createNewIdea(this.newIdeaForm.value)
            .subscribe((res: any) => {
              this.handleIdeaCreatedResponse(res);
            }, error => {
              console.error(error);
              this.loading = false;
              this.picError = true;
            });
        }
      }else{
        this.tooManyCharDescription = true;
      }
    }else{
      this.tooManyCharTitle = true;
    }
  }

  handleIdeaCreatedResponse(idea){
    this.picError = false;
    this.loading = false;
    if(this.ideaList.length > 11){
      this.byPageNumber(this.paginatorData["first_page_url"]);
    }else{
      var toInsert = idea['idea'];
      toInsert['user'] = idea['user'];
      toInsert['upvotes'] = idea['upvotes'];
      toInsert['categories'] = idea['categories'];
      toInsert['comments_count'] = 0;
      this.ideaList.unshift(toInsert);
    }

    this.newIdeaForm.controls["ideaTitle"].setValue("");
    this.newIdeaForm.controls["ideaDesc"].setValue("");
    this.postNewIdeaButton();
    this.submitted = false;

    setTimeout( () => { document.getElementById(idea['idea'].id).scrollIntoView({ block: 'center',  behavior: 'smooth' }); }, 1000 );
  }

  checkUpvotedStatus(){
    // check if an idea is upvoted by the current user
    for (var i = 0; i < this.ideaList.length; i++) {
      for (var j = 0; j < this.ideaList[i].upvotes.length; j++) {
        if(this.ideaList[i].upvotes[j]['user_id'] == this.userId){
          this.ideaList[i]['upvoted'] = true;
          break;
        }
      }
    }
  }

  upvote(event: MouseEvent, ideaId){
    if(this.isLoggedIn){
      var postData = {
        'ideaId': ideaId,
        'token': this.token['token']
      };
      event.preventDefault();
      this.ideaService.upvote(postData)
      .subscribe(
        data => {
          let isUpvoted = this.ideaList.filter(x => x.id == ideaId)[0].upvoted;
          if(isUpvoted){
            this.ideaList.filter(x => x.id == ideaId)[0].upvoted = false;
            this.ideaList.filter(x => x.id == ideaId)[0].upvotes_count -= 1;
          }else{
            this.ideaList.filter(x => x.id == ideaId)[0].upvoted = true;
            this.ideaList.filter(x => x.id == ideaId)[0].upvotes_count += 1;
          }
      }, error => {
        console.error(error);
      });
    }else{
      event.preventDefault();
      this.router.navigateByUrl('/login');
    }
  }
  
  // admin/mod delete
  deleteIdea(ideaId, userId){
    document.getElementById("closeButton-" + ideaId).click();
    this.ideaService.deleteIdeaByAdmin({
      "ideaId": ideaId,
      "token": this.token['token'],
      "userId": userId
    }).subscribe(
      data => {
        this.ideaList = this.ideaList.filter(({ id }) => id !== ideaId); 
      },
      error => {
        console.log('Error while deleting idea');
      }
    );
  }

  // to submit search
  searchSubmit(){
    if(this.searchForm.value["searchInput"].trim()){
      this.searchLoading = true;
      this.searchService.getIdeaSearchResults(this.searchForm.value["searchInput"].trim()).subscribe(
        data => {
          this.paginatorData = data;
          this.ideaList = data['data'];
          this.searchLoading = false;
        },
        error => console.log(error)
      );
    }else{
      this.initIdeas();
    }
  }

  // paginator 
  prevPage() {
    this.ideaService.getIdeasByUrl(this.paginatorData.prev_page_url).subscribe(
      data => {
        this.paginatorData = data;
        this.ideaList = data["data"];
        this.checkUpvotedStatus();
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }

  nextPage() {
    this.ideaService.getIdeasByUrl(this.paginatorData.next_page_url).subscribe(
      data => {
        this.paginatorData = data;
        this.ideaList = data["data"];
        this.checkUpvotedStatus();
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }

  byPageNumber(pageNumber) {
    let url = this.paginatorData["path"] + "?page=" + pageNumber;
    this.ideaService.getIdeasByUrl(url).subscribe(
      data => {
        this.paginatorData = data;
        this.ideaList = data["data"];
        this.checkUpvotedStatus();
      },
      error => console.log(error)
    );
    window.scroll(0,0);
  }
}
