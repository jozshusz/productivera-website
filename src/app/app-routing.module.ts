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

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},

  { path: 'home', component: HomeComponent },
  { path: 'ideas', component: IdeasComponent },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'request-pw-reset',
    component: RequestResetComponent
  },
  {
    path: 'response-pw-reset',
    component: ResponseResetComponent
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
