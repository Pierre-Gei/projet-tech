import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-creation-liste',
  templateUrl: './creation-liste.component.html',
  styleUrls: ['./creation-liste.component.css']
})
export class CreationListeComponent {
  name: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public liste:any, public dialogRef: MatDialogRef<CreationListeComponent>) { }

  closeDialog(){
    this.dialogRef.close(this.name);
  }
}
