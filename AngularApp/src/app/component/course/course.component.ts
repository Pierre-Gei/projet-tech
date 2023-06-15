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
  saveTime: any = [{ name: "eeee", time: "00:00:00" }, { name: "eeee", time: "00:00:00" }];
  isConnected: boolean = false;
  macAddress: any = [];
  connecting: boolean = false;
  lastTime = {
    name: "",
    time: ""
  }
  isStarted: boolean = false;
  loading: boolean = false;
  listeEleve: Eleve = {
    name: "",
    time: []
  }
  name:string = "";

  constructor(public dialog: MatDialog, private timerService: TimersService) {
    this.socket$ = webSocket('ws://localhost:8080');
  }

  connect() {
    this.socket$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data: any) => {
        console.log('Message received:', data);
        console.log('Le type sale chien', typeof (data));
        if (data.message && typeof (data.message) === 'string') {

          if (data.message.startsWith('started')) {
            this.startTimer();
          }
          else if (data.message.startsWith('stopped')) {
            this.stopTimer();
          }
          else if (data.message == "isConnected") {
            this.isConnected = data.isConnected;
            if (this.isConnected) {
              this.loading = false;
            }
            console.log("eeeee" + data.isConnected);
          }
          else if (data.message == "connexion") {
            this.macAddress = data.tabMacAddress;
            this.macAddress.forEach((element: any) => {
              console.log(element);
            });
            console.log("macAddress" + this.macAddress);
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
      console.log("Regarde : ", response);
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  startTimer() {
    const startTime = moment(); // Utilisation d'une nouvelle variable locale
    this.timer = setInterval(() => {
      const currentTime = moment();
      const duration = moment.duration(currentTime.diff(startTime));
      const timerValue = moment.utc(duration.asMilliseconds()).format('mm:ss:SS');
      this.timeElapsedDisplay = timerValue;
    }, 1);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.lastTime = {
      name: "",
      time: this.timeElapsedDisplay
    }
    this.saveTime.push(this.lastTime);
    this.sortTimes();
    this.listeEleve.time = this.saveTime;
    this.timerService.updateTimer(this.listeEleve);
    console.log(this.saveTime);
    this.isStarted = false;
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
        console.log("previousMacAddress" + previousMacAddress);
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
            data: this.macAddress
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log("resultat : " + result);
            if (result == undefined) {
              return;
            }
            this.loading = true;
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
    this.saveTime.sort((a: any, b: any) => {
      // Convertir les temps en millisecondes pour effectuer la comparaison
      const timeA = moment.duration(a.time).asMilliseconds();
      const timeB = moment.duration(b.time).asMilliseconds();

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
  deleteTime(time: any) {
    this.saveTime = this.saveTime.filter((t: any) => t !== time);
    this.listeEleve.time = this.saveTime;
    this.timerService.updateTimer(this.listeEleve);
  }

  createListTime(name: string) {
    this.listeEleve = {
      name: name,
      time: []
    }
    this.timerService.createTimer(this.listeEleve).subscribe((data: any) => {
      console.log(data);
    }
    );
  }
}