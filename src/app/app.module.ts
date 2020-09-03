import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
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
import { CommentsComponent } from './comments/comments.component';
import { OthersProfileComponent } from './others-profile/others-profile.component';
import { CommunityComponent } from './community/community.component';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@NgModule({
   declarations: [		
      AppComponent,
      NavigationComponent,
      FooterComponent,
      IdeasComponent,
      LoginComponent,
      ProfileComponent,
      RequestResetComponent,
      ResponseResetComponent,
      SignupComponent,
      CommentsComponent,
      OthersProfileComponent,
      CommunityComponent,
      PostCommentsComponent,
      PrivacyPolicyComponent,
      TermsAndConditionsComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      MatCardModule,
      MatButtonModule,
      MDBBootstrapModule.forRoot(),
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      MatListModule,
      MatBadgeModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatDividerModule,
      MatSelectModule,
      BrowserAnimationsModule,
      MatRadioModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
