import { Component, OnInit } from '@angular/core';
import { Eleve } from 'src/app/model/eleve';
import { TimersService } from 'src/app/service/timers.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent {
  listeCourse: any = [];
  listeEleve:Eleve = {
    _id:"",
    name:"",
    time:[]
  }
  constructor(private timerService:TimersService) { }

  ngOnInit() {
    this.timerService.getTimer().subscribe((data:Eleve[])=>{
      this.listeCourse = data;
      console.log(this.listeCourse);
    })
  }

  selectCourse(eleve:Eleve){
    this.listeEleve = eleve;
  }

  deleteCourse(eleve:Eleve){
    this.timerService.deleteTimer(eleve).subscribe((data:Eleve)=>{
      this.listeCourse = this.listeCourse.filter((e:Eleve)=>{
        return e._id !== eleve._id;
      })
    })
  }
  deleteTime(time:any){
    this.listeEleve.time = this.listeEleve.time.filter((e:any)=>{
      return e !== time;
    });
    this.timerService.updateProduct(this.listeEleve).subscribe();

  }
}
