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
import { MatButtonModule } from '@angular/material/button'

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      NavigationComponent,
      FooterComponent,
      SideNavProjectsComponent,
      IdeasComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      MatCardModule,
      MatButtonModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
