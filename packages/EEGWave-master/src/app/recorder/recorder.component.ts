import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { EEGSample, channelNames, XYZ } from 'muse-js';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css'],
})
export class RecorderComponent implements OnInit {
  @Input() data: Observable<EEGSample>;
  @Input() accelerometer: BehaviorSubject<XYZ>;
  @Input() gyroscope: BehaviorSubject<XYZ>;

  recording = false;

  private samples: number[][];
  private EEGsubs: Subscription;
  // private ACCELsubs: Subscription;

  constructor() {}

  ngOnInit() {}

  startRecording() {
    this.recording = true;
    this.samples = [];
    this.EEGsubs = this.data
      .pipe(
        switchMap(samples => {
          return this.accelerometer.pipe(
            switchMap(xyz => {
              return this.gyroscope.pipe(
                tap(gyro => {
                  this.samples.push([
                    samples.timestamp,
                    ...samples.data,
                    xyz.x,
                    xyz.y,
                    xyz.z,
                    gyro.x,
                    gyro.y,
                    gyro.z,
                  ]);
                })
              );
            })
          );
        })
      )
      .subscribe();
    console.log(new Date());
  }

  stopRecording() {
    this.recording = false;
    this.EEGsubs.unsubscribe();
    this.saveToCsv(this.samples);
    // console.log(this.samples);
  }

  get sampleCount() {
    return this.samples.length;
  }

  saveToCsv(samples: number[][]) {
    const a = document.createElement('a');
    const headers = [
      'time',
      ...channelNames,
      'accelX',
      'accelY',
      'accelZ',
      'gyroX',
      'gyroY',
      'gyroZ',
    ].join(',');
    const csvData =
      headers + '\n' + samples.map(item => item.join(',')).join('\n');
    const file = new Blob([csvData], { type: 'text/csv' });
    a.href = URL.createObjectURL(file);
    document.body.appendChild(a);
    a.download = 'recording.csv';
    a.click();
    document.body.removeChild(a);
  }
}
