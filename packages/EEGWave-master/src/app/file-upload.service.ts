import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { DataService } from './shared/data.service';
import { AuthService } from './core/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  //definitions for FileStorage
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  sessionID: number;

  constructor(
    public storage: AngularFireStorage,
    public db: AngularFirestore,
    public dataService: DataService,
    public authService: AuthService
  ) {}

  //how to pull data to confirm the most recent ID currently for files
  startUpload(file: Blob, fileName: string) {
    if (this.dataService.user !== '') {
      const path = `${this.dataService.user}/${fileName}`;
      this.task = this.storage.upload(path, file);
      this.percentage = this.task.percentageChanges();
      this.updateDB(fileName);
    }
  }

  updateDB(filename: string) {
    this.db
      .collection('Users')
      .doc(this.dataService.user)
      .collection('Sessions')
      .doc(filename)
      .set({
        // sessionID: this.sessionID,
        fileId: filename,
        startTime: this.dataService.startTime,
        activityStartTime: this.dataService.activityStartTime,
        activityStopTime: this.dataService.activityStopTime,
        stopTime: this.dataService.stopTime,
        activity: this.dataService.activity,
        songId: this.dataService.songId,
      });
    // this.db
    //   .collection('AllSessions')
    //   .doc(this.sessionID.toString())
    //   .set({
    //     sessionID: this.sessionID,
    //     fileId: filename,
    //     startTime: this.dataService.startTime,
    //     activityStartTime: this.dataService.activityStartTime,
    //     activityStopTime: this.dataService.activityStopTime,
    //     stopTime: this.dataService.stopTime,
    //     activity: this.dataService.activity,
    //     songId: this.dataService.songId,
    //   });
    // this.db
    // .collection('SessionsInfo')
    // .doc('main')
    // .set({ sessionID: this.sessionID.toString() });
  }

  //import put it in my constructor then to this.name.whatever item
  // updateScore(
  //   user: string,
  //   time: Date,
  //   score: Number,
  //   sessionID: Number,
  //   gameNumber: Number,
  //   timeScoreID: Number
  // ) {
  //   this.db
  //     .collection('Users')
  //     .doc(user)
  //     .collection('Sessions')
  //     .doc(sessionID.toString())
  //     .collection('Simon')
  //     .doc(gameNumber.toString())
  //     .collection('TimeScores')
  //     .doc(timeScoreID.toString())
  //     .set({
  //       TimeScore: {
  //         time: new Date(time),
  //         score: score,
  //       },
  //     });
  // }

  // updateMusic(user: string, sessionID: Number, songID: Number) {
  //   this.db
  //     .collection('Users')
  //     .doc(user)
  //     .collection('Sessions')
  //     .doc(sessionID.toString())
  //     .collection('Music')
  //     .doc(songID.toString())
  //     .set({
  //       songID: songID,
  //     });
  // }

  // findMostRecentSessionID(user: string) {
  // const sessions = this.db.collection('Users').doc(user);
  // .collection('Sessions').orderBy;
  // var recentID = sessions.where('sessionID', '>=', 'sessionID');
  // const recentID = sessions.orderBy('sessionID', 'desc').limit(1);
  // return recentID + 1;
  // }
}
