import { Component, OnInit, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import * as moment from 'moment';
import { ConnexionComponent } from '../connexion/connexion.component';
import { Eleve } from 'src/app/model/eleve';
import { TimersService } from 'src/app/service/timers.service';
import { ChargementComponent } from '../chargement/chargement.component';
import { CreationListeComponent } from '../creation-liste/creation-liste.component';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, OnDestroy {
  private socket$: WebSocketSubject<any>;
  private unsubscribe$ = new Subject<void>();

  messages: string[] = [];

  timeElapsedDisplay: string = '00:00:00';
  startTime: moment.Moment = moment();
  timer: any;
  timeElapsed: string = '00:00:00';
  dataReceived: string | undefined;
  isConnected: boolean = false;
  macAddress: any = [];
  connecting: boolean = false;
  lastTime = {
    name: "",
    time: "",
    midTime: "",
    pointTot: 0,
    pointMid: 0,
    pointEnd: 0
  }
  isStarted: boolean = false;
  loading: boolean = false;
  listeEleve: Eleve = {
    _id: "",
    name: "",
    time: []
  }
  coockie:any ={
    name: "",
    id : ""
  }

  cptButton: number = 0;
  cptCapteur: number = 0;
  
  gameMode : boolean = false;
  isSaved : boolean = false;

  constructor(public dialog: MatDialog, private timerService: TimersService) {
    this.socket$ = webSocket('ws://localhost:8080');
  }

  connect() {
    this.socket$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data: any) => {
        console.log('Message received:', data);
        if (data.message && typeof (data.message) === 'string') {

          if (data.message.startsWith('started')) {
            this.startTimer();
          }
          else if (data.message.startsWith('stopped')) {
            if(this.cptCapteur == 0 && this.cptButton == 1) {
              this.cptButton = 0;
              this.stopTimer(0);
            }
            else if(this.cptCapteur == 0 && this.cptButton == 0) {
              this.midTimer(0);
              this.cptCapteur++;
            }
          }
          else if (data.message.startsWith('boutton') && this.isStarted) {
            if(this.cptButton == 0 && this.cptCapteur == 1) {
              this.cptCapteur = 0;
              this.stopTimer(1);
            }
            else if (this.cptButton == 0 && this.cptCapteur == 0) {
              this.midTimer(1);
              this.cptButton++;
            }
          }
          else if (data.message == "isConnected") {
            this.isConnected = data.isConnected;
            if (this.isConnected) {
              this.loading = false;
            }
          }
          else if (data.message == "connexion") {
            this.macAddress = data.tabMacAddress;
            this.macAddress.forEach((element: any) => {
            });
          }
        }
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      },
      complete: () => {
        console.log('WebSocket connection closed');
      },
    });
  }

  ngOnInit() {
    this.connect();
    this.sendMessage("isConnected");
    this.timerService.getTimerCookieName().subscribe(response => {
      this.coockie.name = response.name;
      this.coockie.id = response.id;
      this.listeEleve.name = this.coockie.name;
      this.listeEleve._id = this.coockie.id;
      if(this.coockie.name != undefined){
        this.timerService.getById(this.coockie.id).subscribe(response => {
          this.listeEleve.time = response.time;
        });
      }
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  startTimer() {
    this.isSaved = false;
    this.lastTime = {
      name: "",
      time: "",
      midTime: "",
      pointTot: 0,
      pointMid: 0,
      pointEnd: 0
    }
    const startTime = moment(); // Utilisation d'une nouvelle variable locale
    this.timer = setInterval(() => {
      const currentTime = moment();
      const duration = moment.duration(currentTime.diff(startTime));
      const timerValue = moment.utc(duration.asMilliseconds()).format('mm:ss:SS');
      this.timeElapsedDisplay = timerValue;
    }, 1);
  }

  stopTimer(difficulty: number) {
    this.isSaved = false;
    clearInterval(this.timer);
    this.lastTime.name = "";
    this.lastTime.time = this.timeElapsedDisplay;
    if(difficulty == 0){
      let millisecondes = this.convertToMs(this.timeElapsedDisplay);
      let midTimeMs = this.convertToMs(this.lastTime.midTime);
      console.log("Difficulté : 0");
      console.log("millisecondes : " + millisecondes);
      console.log("midTimeMs : " + midTimeMs);
      this.lastTime.pointEnd = Math.round(10000 * Math.exp(-((millisecondes - midTimeMs)  / 10000)));
    }
    else if(difficulty == 1){
      let millisecondes = this.convertToMs(this.timeElapsedDisplay);
      let midTimeMs = this.convertToMs(this.lastTime.midTime);
      console.log("Difficulté : 1");
      console.log("millisecondes : " + millisecondes);
      console.log("midTimeMs : " + midTimeMs);
      this.lastTime.pointEnd = Math.round(15000 * Math.exp(-((millisecondes - midTimeMs) / 10000)));
    }
    this.lastTime.pointTot = this.lastTime.pointEnd + this.lastTime.pointMid;
    this.listeEleve.time.push(this.lastTime);
    this.sortTimes();
    this.updateListTimeBDD();
    this.isStarted = false;
  }

  midTimer(difficulty: number) {
    if(this.lastTime.midTime == "" && difficulty == 0){
      this.lastTime.midTime = this.timeElapsedDisplay;
      let millisecondes = this.convertToMs(this.lastTime.midTime);
      this.lastTime.pointMid = Math.round(10000 * Math.exp(-(millisecondes / 10000)));
    }
    else if(this.lastTime.midTime == "" && difficulty == 1){
      this.lastTime.midTime = this.timeElapsedDisplay;
      let millisecondes = this.convertToMs(this.lastTime.midTime);
      this.lastTime.pointMid = Math.round(15000 * Math.exp(-(millisecondes / 10000)));
    }
  }

  convertToMs(time: string): number {
    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return (minutes * 60 + seconds) * 1000 + milliseconds;
  }

  sendMessage(message: any) {
    const messageToSend = {
      message: message
    };
    this.socket$.next(messageToSend);
  }

  async onConnexion(): Promise<void> {
    if (this.connecting) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      this.sendMessage("connexion");
      this.connecting = true;
      let previousMacAddress: any = [];
      if (this.macAddress !== undefined) {
        previousMacAddress = JSON.parse(JSON.stringify(this.macAddress));
      }
      let maxTime = 10000;
      let timeElapsed = 0;

      const checkDataInterval = setInterval(() => {
        timeElapsed += 100;
        if (this.hasChanged(this.macAddress, previousMacAddress) || timeElapsed >= maxTime) {
          clearInterval(checkDataInterval);
          this.loading = false;
          const dialogRef = this.dialog.open(ConnexionComponent, {
            width: '500px',
            data: this.macAddress,
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
              return;
            }
            if(result != '' && result != undefined){
              this.loading = true;
            }
            
            let message = {
              message: "macAddress",
              macAddress: result
            }
            this.socket$.next(message);
            resolve();
          });
        }
      }, 100);
    }).finally(() => {
      this.connecting = false;
      console.log("connexion " + this.connecting);
    });
  }

  loadingLists() {
    this.isSaved = false;
    const dialogRef = this.dialog.open(ChargementComponent, {
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined || result == '') {
        return;
      }
      this.timerService.getById(result).subscribe(response => {
        this.listeEleve.time = response.time;
        this.listeEleve.name = response.name;
        this.listeEleve._id = response._id;
        this.coockie.name = response.name;
        this.coockie.id = response._id;
        this.timerService.setTimerCookieName(this.coockie).subscribe();
      });
    });
  }

  createCourse() {
    this.isSaved = false;
    const dialogRef = this.dialog.open(CreationListeComponent, {
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined || result == '') {
        return;
      }
      this.createListTime(result);
    });
  }
  

  hasChanged(macAddress: any, previousMacAddress: any) {
    if (macAddress.length !== previousMacAddress.length) {
      return true;
    }
    for (let i = 0; i < macAddress.length; i++) {
      if (macAddress[i].name !== previousMacAddress[i].name) {
        return true;
      }
    }
    return false;
  }

  sortTimes() {
    this.listeEleve.time.sort((a: any, b: any) => {
      // Convertir les temps en millisecondes pour effectuer la comparaison
      const timeA = moment(a.time, 'mm:ss:SSS').valueOf();
      const timeB = moment(b.time, 'mm:ss:SSS').valueOf();
  
      // Comparer les temps et renvoyer le résultat de la comparaison
      if (timeA < timeB) {
        return -1;
      } else if (timeA > timeB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  sortTimesByPoint() {
    this.listeEleve.time.sort((a: any, b: any) => {
      // Convertir les temps en millisecondes pour effectuer la comparaison
      const pointA = a.pointTot;
      const pointB = b.pointTot;
  
      // Comparer les temps et renvoyer le résultat de la comparaison
      if (pointA > pointB) {
        return -1;
      } else if (pointA < pointB) {
        return 1;
      } else {
        return 0;
      }
    });
  }


  deleteTime(time: any) {
    this.isSaved = false;
    this.listeEleve.time = this.listeEleve.time.filter((t: any) => t !== time);
    this.timerService.updateProduct(this.listeEleve).subscribe();
  }

  createListTime(name: string) {
    this.isSaved = false;
    this.listeEleve = {
      name: name,
      time: []
    }
    this.timerService.createTimer(this.listeEleve).subscribe((data: any) => {
      this.listeEleve._id = data.insertedId;
      this.coockie.name = name;
      this.coockie.id = data.insertedId;
    }
    );
    
  }

  updateListTimeBDD(){
    
    this.timerService.updateProduct(this.listeEleve).subscribe();
    this.isSaved = true;
  }
}