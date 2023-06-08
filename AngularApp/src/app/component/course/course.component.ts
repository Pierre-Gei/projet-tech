import { Component, OnInit, OnDestroy } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
declare var navigator: any;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, OnDestroy {
  private socket$:WebSocketSubject<any>;
  private unsubscribe$ = new Subject<void>();

  messages:string[] = [];

  timeElapsedDisplay: string = '00:00:00';
  startTime: moment.Moment = moment();
  timer: any;
  timeElapsed: string = '00:00:00';
  dataReceived: string | undefined;
  saveTime:string[] = [];

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080');
  }

  connect() {
    this.socket$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data:any) => {
        console.log('Message received:', data);
        console.log('Le type sale chien',typeof(data));
        console.log('stringify',JSON.stringify(data));
        if(data.message == "Started\r\n" )
        {
          this.startTimer();
        }
        else if(data.message == "stopped\r\n")
        {
          this.stopTimer();
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
    this.saveTime.push(this.timeElapsedDisplay);
    console.log(this.saveTime);

  }

  sendMessage(message:any){
    const messageToSend = {
      message: message
    };
    this.socket$.next(messageToSend);
  }
}