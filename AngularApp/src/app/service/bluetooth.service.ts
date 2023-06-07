import { Injectable } from '@angular/core';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor(public ble: BluetoothCore) { }

  getDevice() {
    return this.ble.getDevice$();
  }

  stream() {
    return this.ble.streamValues$().pipe(
      map((value: DataView) => value.getInt8(0))
    );
  }

  disconnectDevice() {
    this.ble.disconnectDevice();
  }

  // value() {
  //   console.log('value');
  //   return this.ble.value$({
  //     service: 'battery_service',
  //     characteristic: 'battery_level'
  //   });
  // }

}
