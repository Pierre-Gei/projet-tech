import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  selectedMacAddress:any = null;
  constructor(@Inject(MAT_DIALOG_DATA) public macAddresses:any, public dialogRef: MatDialogRef<ConnexionComponent>) { }

  selectMacAddress(macAddress:any){
    console.log("NOM macAddress" + macAddress.name);
    this.selectedMacAddress = macAddress;
  }

  closeDialog(){
    this.dialogRef.close(this.selectedMacAddress.macAddress);
  }



}
