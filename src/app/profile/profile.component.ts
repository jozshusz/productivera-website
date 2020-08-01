import { Component, OnInit } from '@angular/core';
import { StatusService } from '../services/status.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileInfo = null;
  token = null;

  constructor(
    private statusService: StatusService,
    private router: Router,
    private tokenService: TokenService,
    private profileService: ProfileService
    ) { }

  ngOnInit() {
    this.token = {
      'token': this.tokenService.get()
    };

    this.profileService.getOwnProfile(this.token).subscribe(
      data => {
        this.profileInfo = data[0];
      },
      error => {
        console.log(error);
      }
    );
  }
  
  logout(event: MouseEvent){
    event.preventDefault();
    this.statusService.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
    this.tokenService.remove();
  }
}
