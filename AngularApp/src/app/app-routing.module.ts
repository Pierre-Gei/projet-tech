import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './component/course/course.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { GestionComponent } from './component/gestion/gestion.component';


const routes: Routes = [
  {
    path:'',
    component: AccueilComponent
  },
  {
    path: 'course',
    component: CourseComponent
  },
  {
    path:'gestion',
    component: GestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
