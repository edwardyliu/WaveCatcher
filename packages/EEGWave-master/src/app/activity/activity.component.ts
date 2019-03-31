import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit, OnDestroy {
  @Input() recording = false;
  selectedIndex = 0;
  activityNames: string[] = ['Simon', 'Music'];
  activity: string;
  activityDuration = 180;
  songId: number;
  audioPath: string;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.activity = this.activityNames[0];
    this.dataService.activityDuration = this.activityDuration;
  }
  ngOnDestroy() {}
  receiveActivity($event) {
    this.activity = this.activityNames[$event.index];
    this.dataService.activity = this.activity;
  }
  receiveActivityDuration($event) {
    this.activityDuration = $event;
    this.dataService.activityDuration = $event;
  }
  receiveSongId($event) {
    this.songId = $event;
    this.dataService.songId = $event;
  }
  receiveAudioPath($event) {
    this.audioPath = $event;
    this.dataService.audioPath = $event;
  }
}
