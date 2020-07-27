import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { SideNavProjectsComponent } from './side-nav-projects/side-nav-projects.component';
import { IdeasComponent } from './ideas/ideas.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResponseResetComponent } from './response-reset/response-reset.component';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      NavigationComponent,
      FooterComponent,
      SideNavProjectsComponent,
      IdeasComponent,
      LoginComponent,
      ProfileComponent,
      RequestResetComponent,
      ResponseResetComponent,
      SignupComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      MatCardModule,
      MatButtonModule,
      MDBBootstrapModule.forRoot(),
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
