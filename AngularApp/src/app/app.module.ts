import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseComponent } from './component/course/course.component';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { AccueilComponent } from './component/accueil/accueil.component';


@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    AccueilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebBluetoothModule.forRoot({
      enableTracing: true // or false, this will enable logs in the browser's console
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
