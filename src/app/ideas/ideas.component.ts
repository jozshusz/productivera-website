import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IdeaService } from '../services/idea.service';
import { ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../services/token.service';

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

  postNewIdea = false;
  selectedFile: File = null;

  @ViewChild('selectFileInput')
  selectFileInput: ElementRef;

  picResponseMessage = null;
  picErrorMessage = null;

  constructor(
    private formBuilder: FormBuilder,
    private ideaService: IdeaService,
    private tokenService: TokenService
    ) { }

  ngOnInit() {
    this.newIdeaForm = this.formBuilder.group({
      ideaTitle: ['', Validators.required],
      ideaDesc: ['', Validators.required],
      token: null
    });

    this.token = {
      'token': this.tokenService.get()
    };
    this.userId = this.tokenService.getUserId();
    this.initIdeas();
  }

  initIdeas(){
    this.ideaService.getIdeas()
      .subscribe((res: any) => {
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
    this.postNewIdea = !this.postNewIdea;
    this.selectedFile = null
  }

  // Upload idea pic
  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
  }

  createNewPostButton(){
    if(this.selectedFile != null){
      const formData = new FormData();
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      formData.append('image', this.selectedFile);
      formData.append('ideaTitle', this.newIdeaForm.value['ideaTitle']);
      formData.append('ideaDesc', this.newIdeaForm.value['ideaDesc']);
      formData.append('token', this.token['token']);
      this.ideaService.createNewIdeaWithPic(formData, headers)
        .subscribe((res: any) => {
          this.handleIdeaCreatedResponse(res);
        }, error => {
          console.error(error);
        });
    }else{
      this.newIdeaForm.controls['token'].setValue(this.token['token']);
      this.ideaService.createNewIdea(this.newIdeaForm.value)
        .subscribe((res: any) => {
          this.handleIdeaCreatedResponse(res);
        }, error => {
          console.error(error);
        });
    }
  }

  handleIdeaCreatedResponse(idea){
    var toInsert = idea['idea'];
    toInsert['user'] = idea['user'];
    toInsert['upvotes'] = idea['upvotes'];
    this.ideaList.push(toInsert);

    this.newIdeaForm.controls["ideaTitle"].setValue("");
    this.newIdeaForm.controls["ideaDesc"].setValue("");
    this.postNewIdeaButton();
    this.submitted = false;
    console.log(idea['idea'].id);

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
  }
}
