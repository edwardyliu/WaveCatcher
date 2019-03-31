import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DataService {
  public startTime: number;
  public activityStartTime: number;
  public activityStopTime: number;
  public stopTime: number;
  public activity: string;
  public activityDuration: number = 180;
  public songId: number;
  public audioPath: string;

  public user: string = '';
  public time: number;
  public score: number;
  public sessionID: number;
  public gameNumber: number;
  public timeScoreID: number;

  //user (initials)
  //Object { time: date score: number}
  //sessionID --> call function in file upload service
  //gamenumber
  //timescoreID for object (increment in loop)
  getNoiseAudioPath() {
    return '../../assets/sounds/BrownNoise30secs.mp3';
  }
  outputData() {
    console.log(
      this.activity,
      this.startTime,
      this.activityStartTime,
      this.activityStopTime,
      this.stopTime
    );
  }
}
