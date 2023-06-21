import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { TimersService } from 'src/app/service/timers.service';

@Component({
  selector: 'app-chargement',
  templateUrl: './chargement.component.html',
  styleUrls: ['./chargement.component.css']
})
export class ChargementComponent {
  selectedListe:string = "";
  Listes:any[] = [];
  
  constructor(@Inject(MAT_DIALOG_DATA) public liste:any, public dialogRef: MatDialogRef<ChargementComponent>, private timerService:TimersService) { }
  ngOnInit() {
    this.timerService.getTimer().subscribe((data:any) => {
      this.Listes = data;
      console.log("Listes: " + this.Listes);
    });
  }

  selectListe(liste:any){
    this.selectedListe = liste._id;
  }

  closeDialog(){
    this.dialogRef.close(this.selectedListe);
  }

}
