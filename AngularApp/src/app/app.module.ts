import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseComponent } from './component/course/course.component';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { AccueilComponent } from './component/accueil/accueil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnexionComponent } from './component/connexion/connexion.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    AccueilComponent,
    ConnexionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebBluetoothModule.forRoot({
      enableTracing: true // or false, this will enable logs in the browser's console
    }),
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
