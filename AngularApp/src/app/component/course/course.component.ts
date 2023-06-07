import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
declare var navigator: any;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  timeElapsedDisplay: string = '00:00:00';
  startTime: moment.Moment = moment();
  timer: any;
  timeElapsed: string = '00:00:00';
  dataReceived: string | undefined;

  constructor() {
  }

  ngOnInit() {
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
  }

  bluetoothConnect() {
    const options = {
      acceptAllDevices: true,
      optionalServices: ['battery_service']
    };
    const device = navigator.bluetooth.requestDevice(options);
    device.then((device: any) => {
      console.log(device);
    });
  }
}