import { Component } from '@angular/core';
import { BluetoothService } from '../services/bluetooth-services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isScanning = false;
  isConnecting = false;
  isPlaying = false;
  selectedDevice: any = null;
  devices: any[] = [];
  showNoDevicesMessage = false;

  // Subscripciones
  public subscriptions: Subscription[] = [];

  constructor(public bluetoothService: BluetoothService) { }

  ngOnInit() {
    this.bluetoothService.initializeBluetooth();

    // Suscribirse a los cambios de estado
    this.subscriptions.push(
      this.bluetoothService.isScanning$.subscribe(scanning => {
        this.isScanning = scanning;
      })
    );

    this.subscriptions.push(
      this.bluetoothService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
      })
    );
  }

  ngOnDestroy() {
    // Limpieza de subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async scanDevices() {
    this.showNoDevicesMessage = false;

    // No es necesario establecer isScanning aquí, ya está manejado por el servicio
    await this.bluetoothService.scanDevices();

    // Obtener la lista de dispositivos del servicio
    this.devices = this.bluetoothService.devices;

    // Mostrar mensaje si no hay dispositivos después del escaneo
    setTimeout(() => {
      this.showNoDevicesMessage = this.devices.length === 0;
    }, 5000);
  }

  async connect(device: any) {
    this.isConnecting = true;
    try {
      await this.bluetoothService.connectToDevice(device.deviceId);
      this.selectedDevice = device;
    } catch (error) {
      console.error('Error al conectar:', error);
    } finally {
      this.isConnecting = false;
    }
  }

  async disconnect() {
    await this.bluetoothService.disconnectDevice();
    this.selectedDevice = null;
  }

  async sendMessage() {
    try {
      // serviceUUID y characteristicUUID deben ser reemplazados por tus valores reales
      await this.bluetoothService.sendData('tu-service-uuid', 'tu-characteristic-uuid');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }
}