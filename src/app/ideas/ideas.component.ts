import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {

  newIdeaForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.newIdeaForm = this.formBuilder.group({
      ideaName: ['', Validators.required]
    });
  }

  onSubmit(){
    this.submitted = true;
  }

  get f() { return this.newIdeaForm.controls; }
}
