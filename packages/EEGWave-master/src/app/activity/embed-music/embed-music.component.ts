import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-embed-music',
  templateUrl: './embed-music.component.html',
  styleUrls: ['./embed-music.component.css'],
})
export class EmbedMusicComponent implements OnInit {
  @Input() recording = false;
  @Output() activityDurationEmitter = new EventEmitter<number>();
  @Output() songIdEmitter = new EventEmitter<number>();
  @Output() audioPathEmitter = new EventEmitter<string>();
  songIds: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  songs: string[] = [
    '0-94stones-limit_break_x_survivor',
    '1-ashes_remain-without_you',
    '2-blackbear-do_re_mi',
    '3-khalid-suncity_ft_empress_of',
    '4-marshmello-alone',
    '5-porter_robinson-shelter',
    '6-shakira-chantaje_ft_maluma',
    '7-verzache-waiting_for_you',
  ];
  songDurations: number[] = [233, 232, 208, 191, 274, 218, 197, 230];
  selectedSongId = 0;
  activityDuration = 233;

  constructor() {}

  ngOnInit() {
    this.updateSongInfo({ value: 0 });
  }

  updateSongInfo($event) {
    this.activityDurationEmitter.emit(this.songDurations[$event.value]);
    this.songIdEmitter.emit($event.value);
    this.audioPathEmitter.emit(this.makeAudioPath(this.songs[$event.value]));
  }

  makeAudioPath(name: string): string {
    return '../../assets/sounds/' + name + '.mp3';
  }
}
