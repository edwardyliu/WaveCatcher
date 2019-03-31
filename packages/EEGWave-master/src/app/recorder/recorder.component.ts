import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EEGSample, channelNames, XYZ } from 'muse-js';
import { Observable, Subscription, BehaviorSubject, interval } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
//Necessary for FileStorage
import { FileUploadService } from '../file-upload.service';
import { DataService } from '../shared/data.service';
import { AuthService } from '../core/auth.service';

// refer here for documentation on simple timer: https://dmkcode.com/2016/08/simple-timer-using-angular-2-and-rxjs/
// https://dmkcode.com/2016/09/simple-timer-using-angular-2-and-rxjs-part-2/

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css'],
})
export class RecorderComponent implements OnInit, OnDestroy {
  @Input() data: Observable<EEGSample>;
  @Input() accelerometer: BehaviorSubject<XYZ>;
  @Input() gyroscope: BehaviorSubject<XYZ>;

  samples: number[][];
  EEGsubs: Subscription;
  Timersubs: Subscription;
  recording = false;
  includeDownload = false;

  start = 0;
  ticks = 0;

  minutesDisplay = 0;
  hoursDisplay = 0;
  secondsDisplay = 0;

  audio: any;

  bufferTime = 30;
  activityDuration: number;
  totalTime: number;

  startTime: number;
  activityStartTime: number;
  activityEndTime: number;
  endTime: number;

  constructor(
    private dataService: DataService,
    public fileUpload: FileUploadService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  //TIMER METHODS
  private getSeconds(ticks: number) {
    return this.pad(ticks % 60);
  }
  private getMinutes(ticks: number) {
    return this.pad(Math.floor(ticks / 60) % 60);
  }
  private getHours(ticks: number) {
    return this.pad(Math.floor(ticks / 60 / 60));
  }
  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }

  recordButton() {
    if (!this.recording) {
      this.recording = true;
      this.startTimer();
    } else alert('Timer must be stopped before starting a new recording');
  }

  discardButton() {
    if (this.recording) {
      this.recording = false;
      this.resetTimer();
      // this.saveData();
    } else alert('Timer must be started before ending a recording');
  }

  private startTimer() {
    this.activityDuration = this.dataService.activityDuration;
    this.totalTime = this.bufferTime * 2 + this.activityDuration;
    this.audio = new Audio(this.dataService.getNoiseAudioPath());
    this.audio.play();
    this.startTime = Date.now();
    this.startRecording();
    const timer = interval(1000);
    this.Timersubs = timer.subscribe(t => {
      this.ticks = this.start + t;

      if (this.ticks === this.bufferTime) {
        this.activityStartTime = Date.now();
        this.audio.pause();
        if (this.dataService.activity === 'Music') {
          this.audio = new Audio(this.dataService.audioPath);
          this.audio.play();
        }
      } else if (this.ticks === this.bufferTime + this.activityDuration) {
        this.activityEndTime = Date.now();
        if (this.dataService.activity === 'Music') {
          this.audio.pause();
        }
        this.audio = new Audio(this.dataService.getNoiseAudioPath());
        this.audio.play();
      }
      if (this.ticks === this.totalTime) {
        this.saveData();
      } else {
        this.secondsDisplay = this.getSeconds(this.ticks);
        this.minutesDisplay = this.getMinutes(this.ticks);
        this.hoursDisplay = this.getHours(this.ticks);
      }
    });
  }

  private resetTimer() {
    this.start = 0;
    this.ticks = 0;

    this.minutesDisplay = 0;
    this.hoursDisplay = 0;
    this.secondsDisplay = 0;

    this.recording = false;
    if (this.EEGsubs) this.EEGsubs.unsubscribe();
    if (this.Timersubs) this.Timersubs.unsubscribe();
    try {
      this.audio.pause();
    } catch (error) {}
  }

  private saveData() {
    this.endTime = Date.now();

    this.dataService.startTime = this.startTime;
    this.dataService.activityStartTime = this.activityStartTime;
    this.dataService.activityStopTime = this.activityEndTime;
    this.dataService.stopTime = this.endTime;

    // this.dataService.startTime = 0;
    // this.dataService.activityStartTime = 1;
    // this.dataService.activityStopTime = 2;
    // this.dataService.stopTime = 3;
    // this.dataService.outputData(); //check console
    this.saveToCsv(this.samples);
    this.resetTimer();
  }

  // RECORDER METHODS
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
    // console.log(new Date());
  }

  get sampleCount() {
    return this.samples.length;
  }

  saveToCsv(samples: number[][]) {
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
    const fileName = Date.now() + '_recording.csv';

    if (this.includeDownload) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      document.body.appendChild(a);
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
    }

    //File is created now save to FireStorage
    this.fileUpload.startUpload(file, fileName);
    //End of FileStorage
  }
}
