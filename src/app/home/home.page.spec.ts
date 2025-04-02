// home.page.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomePage } from './home.page';
import { BluetoothService } from '../services/bluetooth-services';
import { BehaviorSubject, Subscription } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let bluetoothServiceSpy: jasmine.SpyObj<BluetoothService>;
  const isScanningSubject = new BehaviorSubject<boolean>(false);
  const isPlayingSubject = new BehaviorSubject<boolean>(false);

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BluetoothService', [
      'initializeBluetooth',
      'scanDevices',
      'connectToDevice',
      'disconnectDevice',
      'sendData'
    ], {
      isScanning$: isScanningSubject.asObservable(),
      isPlaying$: isPlayingSubject.asObservable(),
      devices: []
    });

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [{ provide: BluetoothService, useValue: spy }]
    }).compileComponents();

    bluetoothServiceSpy = TestBed.inject(BluetoothService) as jasmine.SpyObj<BluetoothService>;
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize subscriptions', () => {
    component.ngOnInit();
    expect(bluetoothServiceSpy.initializeBluetooth).toHaveBeenCalled();

    isScanningSubject.next(true);
    expect(component.isScanning).toBeTrue();

    isPlayingSubject.next(true);
    expect(component.isPlaying).toBeTrue();
  });

  it('should clean up subscriptions on destroy', () => {
    component.ngOnInit();
    const sub = new Subscription();
    spyOn(sub, 'unsubscribe');
    component.subscriptions.push(sub);

    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });

  it('should scan devices and show message if none found', fakeAsync(() => {
    component.scanDevices();
    expect(component.showNoDevicesMessage).toBeFalse();
    expect(bluetoothServiceSpy.scanDevices).toHaveBeenCalled();

    tick(5000);
    expect(component.showNoDevicesMessage).toBeTrue();
  }));

  it('should connect to device', async () => {
    const testDevice = { deviceId: 'test-id' };
    await component.connect(testDevice);
    expect(bluetoothServiceSpy.connectToDevice).toHaveBeenCalledWith('test-id');
    expect(component.selectedDevice).toEqual(testDevice);
  });

  it('should disconnect device', async () => {
    component.selectedDevice = { deviceId: 'test-id' };
    await component.disconnect();
    expect(bluetoothServiceSpy.disconnectDevice).toHaveBeenCalled();
    expect(component.selectedDevice).toBeNull();
  });
});