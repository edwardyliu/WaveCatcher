import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
// import { AngularFirestore } from "@angular/fire/firestore";

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, map, share, takeUntil } from 'rxjs/operators';
import {
  MuseClient,
  MuseControlResponse,
  zipSamples,
  EEGSample,
  XYZ,
} from 'muse-js';

// import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from './core/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eeg-wave';
  connecting = false;
  connected = false;
  data: Observable<EEGSample> | null;
  batteryLevel: Observable<number> | null;
  controlResponses: Observable<MuseControlResponse>;
  accelerometer = new BehaviorSubject<XYZ>(null);
  gyroscope = new BehaviorSubject<XYZ>(null);
  destroy = new Subject<void>();

  private muse = new MuseClient();

  constructor(
    public auth: AuthService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    // Subscribe to userProfile Observable
    // this.auth.user.subscribe(val => console.log(val.displayName));
  }

  ngOnInit() {
    this.muse.connectionStatus
      .pipe(takeUntil(this.destroy))
      .subscribe(status => {
        this.connected = status;
        this.data = null;
        this.batteryLevel = null;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  async connect() {
    this.connecting = true;
    this.snackBar.dismiss();
    try {
      await this.muse.connect();
      this.controlResponses = this.muse.controlResponses;
      await this.muse.start();
      this.data = zipSamples(this.muse.eegReadings).pipe(
        takeUntil(this.destroy),
        tap(() => this.cd.detectChanges()),
        share()
      );
      this.batteryLevel = this.muse.telemetryData.pipe(
        takeUntil(this.destroy),
        map(t => t.batteryLevel)
      );
      this.muse.accelerometerData
        .pipe(
          takeUntil(this.destroy),
          map(reading => reading.samples[reading.samples.length - 1])
        )
        .subscribe(this.accelerometer);
      this.muse.gyroscopeData
        .pipe(
          takeUntil(this.destroy),
          map(reading => reading.samples[reading.samples.length - 1])
        )
        .subscribe(this.gyroscope);
      await this.muse.deviceInfo();
    } catch (err) {
      this.snackBar.open('Connection failed: ' + err.toString(), 'Dismiss');
    } finally {
      this.connecting = false;
    }
  }

  disconnect() {
    this.muse.disconnect();
  }
}
