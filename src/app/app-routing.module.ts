import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IdeasComponent } from './ideas/ideas.component';
import { SideNavProjectsComponent } from './side-nav-projects/side-nav-projects.component';
import { map } from 'rxjs/Operators';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResponseResetComponent } from './response-reset/response-reset.component';
import { SignupComponent } from './signup/signup.component';
import { BeforeLoginService } from './services/before-login.service';
import { AfterLoginService } from './services/after-login.service';
import { CommentsComponent } from './comments/comments.component';
import { OthersProfileComponent } from './others-profile/others-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},

  { path: 'home', component: HomeComponent },
  { path: 'ideas', component: IdeasComponent },
  { path: 'ideas/:ideaId', component: CommentsComponent },
  { path: 'profile/:userId', component: OthersProfileComponent },

  {
    path: 'login',
    component: LoginComponent, 
    canActivate: [BeforeLoginService] 
  },
  {
    path: 'signup',
    component: SignupComponent, 
    canActivate: [BeforeLoginService] 
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AfterLoginService]
  },
  {
    path: 'reqpwreset',
    component: RequestResetComponent, 
    canActivate: [BeforeLoginService]
  },
  {
    path: 'resppwreset',
    component: ResponseResetComponent, 
    canActivate: [BeforeLoginService]
  },

  //left sidebar routes
  {
    path: '',
    component: SideNavProjectsComponent,
    outlet: 'sidebar'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
