import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdeasComponent } from './ideas/ideas.component';
import { map } from 'rxjs/operators';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResponseResetComponent } from './response-reset/response-reset.component';
import { SignupComponent } from './signup/signup.component';
import { BeforeLoginService } from './services/before-login.service';
import { AfterLoginService } from './services/after-login.service';
import { CommentsComponent } from './comments/comments.component';
import { OthersProfileComponent } from './others-profile/others-profile.component';
import { CommunityComponent } from './community/community.component';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  { path: '', redirectTo: '/ideas', pathMatch: 'full'},
  { path: 'ideas', component: IdeasComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'ideas/:ideaId', component: CommentsComponent },
  { path: 'community/:postId', component: PostCommentsComponent },
  { path: 'profile/:userId', component: OthersProfileComponent },
  { path: 'ideas/byUser/:byUser', component: IdeasComponent },
  { path: 'ideas/byCategory/:byCategory', component: IdeasComponent },
  { path: 'community/byUser/:byUser', component: CommunityComponent },
  { path: 'community/byCategory/:byCategory', component: CommunityComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-cond', component: TermsAndConditionsComponent },

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
