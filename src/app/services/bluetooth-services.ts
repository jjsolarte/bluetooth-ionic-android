import { Injectable } from '@angular/core';
import { BluetoothLe } from '@capacitor-community/bluetooth-le';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  devices: any[] = [];
  connectedDeviceId: string | null = null;
  messageError: string = '';
  private audio: HTMLAudioElement;

  private _isScanning = new BehaviorSubject<boolean>(false);
  private _isPlaying = new BehaviorSubject<boolean>(false);

  get isScanning(): boolean {
    return this._isScanning.value;
  }

  get isPlaying(): boolean {
    return this._isPlaying.value;
  }

  isScanning$ = this._isScanning.asObservable();
  isPlaying$ = this._isPlaying.asObservable();

  constructor() {
    this.audio = new Audio('assets/bach_cello.mp3');

    this.audio.onended = () => {
      this._isPlaying.next(false);
    };
  }

  async initializeBluetooth() {
    await BluetoothLe.initialize();
  }

  async scanDevices() {
    this._isScanning.next(true);
    this.devices = [];

    try {
      await BluetoothLe.requestLEScan({ allowDuplicates: false });

      BluetoothLe.addListener('onScanResult', (result: { device: { deviceId: string, name?: string } }) => {
        if (result.device && result.device.deviceId) {
          const exists = this.devices.some(
            (d) => d.deviceId === result.device.deviceId || d.name === result.device.name
          );

          if (!exists) {
            this.devices.push(result.device);
          }
        }
      });

      setTimeout(async () => {
        await BluetoothLe.stopLEScan();
        this._isScanning.next(false);
      }, 5000);
    } catch (error) {
      this._isScanning.next(false);
      console.error('Error al escanear:', error);
    }
  }

  async connectToDevice(deviceId: string) {
    this.messageError = '';
    try {
      await BluetoothLe.connect({ deviceId });
      this.connectedDeviceId = deviceId;
    } catch (error) {
      this.messageError = 'Error string: ' + error;
      console.error('Error al conectar:', error);
    }
  }

  async disconnectDevice() {
    if (this.connectedDeviceId) {
      await BluetoothLe.disconnect({ deviceId: this.connectedDeviceId });
      this.connectedDeviceId = null;
    }
  }

  async sendData(serviceUUID: string, characteristicUUID: string) {
    if (!this.connectedDeviceId) return;

    try {
      this._isPlaying.next(true);
      await this.audio.play();
      console.log('Reproduciendo audio');

    } catch (error) {
      this._isPlaying.next(false);
      console.error('Error al reproducir:', error);
      throw error;
    }
  }

  async readData(serviceUUID: string, characteristicUUID: string, data: string) {
    if (!this.connectedDeviceId) return;

    const encodedData = btoa(data);
    await BluetoothLe.write({
      deviceId: this.connectedDeviceId,
      service: serviceUUID,
      characteristic: characteristicUUID,
      value: encodedData
    });
  }

  stopAudio() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this._isPlaying.next(false);
    }
  }
}