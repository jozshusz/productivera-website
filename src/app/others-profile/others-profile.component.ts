import { Component, OnInit } from '@angular/core';
import { OthersProfileService } from '../services/others-profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-others-profile',
  templateUrl: './others-profile.component.html',
  styleUrls: ['./others-profile.component.scss']
})
export class OthersProfileComponent implements OnInit {

  profileId = null;
  profileInfo = null;

  constructor(
    private othersProfService: OthersProfileService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.profileId = paramMap.get('userId');
      this.initProfile();
    });
  }

  initProfile(){
    this.othersProfService.getOthersProfile(this.profileId).subscribe(
      data => {
        this.profileInfo = data;
      },
      error => console.log(error)
    );
  }

}
