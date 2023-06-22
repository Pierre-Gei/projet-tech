import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseComponent } from './component/course/course.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnexionComponent } from './component/connexion/connexion.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ChargementComponent } from './component/chargement/chargement.component';
import { CreationListeComponent } from './component/creation-liste/creation-liste.component';
import { GestionComponent } from './component/gestion/gestion.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    AccueilComponent,
    ConnexionComponent,
    ChargementComponent,
    CreationListeComponent,
    GestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
