import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-embed-game',
  templateUrl: './embed-game.component.html',
  styleUrls: ['./embed-game.component.css'],
})
export class EmbedGameComponent implements OnInit, OnDestroy {
  @Input() recording = false;
  @Output() activityDurationEmitter = new EventEmitter<number>();
  gameTimes = [180, 300, 600];
  activityDuration = this.gameTimes[0];
  sequence: any = [];
  copy: any = [];
  round: number = 0;
  active: boolean = true;
  mode: string = 'normal';

  hideLose: boolean = true;

  class1: boolean;
  class2: boolean;
  class3: boolean;
  class4: boolean; //not actually per tile
  hover1: boolean;
  hover2: boolean;
  hover3: boolean;
  hover4: boolean; //per tile
  lit1: boolean;
  lit2: boolean;
  lit3: boolean;
  lit4: boolean; //per tile

  constructor() {}
  ngOnInit() {
    this.activityDurationEmitter.emit(this.activityDuration);
  }
  ngOnDestroy() {}

  updateActivityDuration($event) {
    this.activityDurationEmitter.emit($event.value);
  }

  startGame() {
    this.sequence = [];
    this.copy = [];
    this.round = 0;
    this.active = true;
    this.hideLose = true;
    this.newRound();
  }

  newRound() {
    this.round = this.round + 1;
    this.sequence.push(this.randomNumber());
    this.copy = this.sequence.slice(0);
    this.animate(this.sequence);
  }

  registerClick(event: Event) {
    const elementId: string = (event.target as Element).id;
    const desiredResponse = this.copy.shift();

    const time = new Date(Date.now());
    const score = this.round;
    const timescore = [time, score];
    // console.log(timescore);

    this.active = desiredResponse == elementId;
    this.checkLose();
  }
  // three possible situations:
  // 1. The user clicked the wrong color (end the game)
  // 2. The user entered the right color, but is not finished with the sequence (do nothing)
  // 3. The user entered the right color and just completed the sequence (start a new round)
  checkLose() {
    // copy array will be empty when user has successfully completed sequence
    if (this.copy.length == 0 && this.active) {
      this.deactivateSimonBoard();
      this.newRound();
    } else if (!this.active) {
      // user lost
      this.deactivateSimonBoard();
      this.endGame();
    }
  }

  endGame() {
    // notify the user that they lost and change the "round" text to zero
    this.hideLose = false;
    this.round = 0;
  }

  activateSimonBoard(event: Event) {
    const elementId: string = (event.target as Element).id;

    if (event.type == 'mousedown') {
      this['class' + elementId] = true; //addclass dynamically!

      // this.playSound(elementId);
    } else if (event.type == 'mouseup') {
      this['class' + elementId] = false; //removeclass dynamically!
    }
    this['hover' + elementId] = true;
  }
  //
  // 	// prevent user from interacting until sequence is done animating
  deactivateSimonBoard() {
    this.hover1 = false;
    this.hover2 = false;
    this.hover3 = false;
    this.hover4 = false;

    //disable

    //make unclickable
    // if (this.mode !== 'free-board') {
    // 	$('.simon')
    // 		.off('click', '[data-tile]')
    // 		.off('mousedown', '[data-tile]')
    // 		.off('mouseup', '[data-tile]');
    //
    // 	$('[data-tile]').removeClass('hoverable');
    // }
  }

  randomNumber() {
    // between 1 and 4
    return Math.floor(Math.random() * 4 + 1);
  }

  animate(sequence) {
    var i = 0;
    var that = this;
    var interval = setInterval(function() {
      this.hover1 = false;
      this.hover2 = false;
      this.hover3 = false;
      this.hover4 = false;
      // that.playSound(sequence[i]);
      that.lightUp(sequence[i]);

      i = i + 1;
      if (i >= sequence.length) {
        clearInterval(interval);
        this.hover1 = true;
        this.hover2 = true;
        this.hover3 = true;
        this.hover4 = true;
      }
    }, 600);
  }

  lightUp(tile) {
    var id: string = tile;
    var that = this;
    that['lit' + id] = true;
    setTimeout(function() {
      that['lit' + id] = false;
    }, 300);
  }
}
