import { Injectable } from '@angular/core';
import {
  map,
  switchMap,
  interval,
  filter,
  tap,
  BehaviorSubject,
  shareReplay,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BeatService {
  instruments: string[] = [
    'tink',
    'clap',
    'hihat',
    'openhat',
    'ride',
    'snare',
    'kick',
    'tom',
    'boom',
  ];
  patterns: {
    [key: string]: { name: string; active: boolean; bar: number }[];
  } = {};
  private pause = true;
  bpm = 60;
  bpmSub = new BehaviorSubject<number>(this.bpm);
  bars: { name: string; active: boolean; bar: number }[] = [];
  i = -1;
  takt$ = this.bpmSub.pipe(
    map((data) => Math.round((60 / data) * 1000)),
    tap((speed) => (this.bpm = speed)),
    switchMap((b) => interval(b)),
    filter(() => !this.pause),
    map(() => ++this.i),
    map((v) => {
      if (v >= 8) {
        this.i = 0;
        return 0;
      }
      return v;
    }),
    tap((data) => console.log('IIIII', data)),
    shareReplay()
  );

  updatePatterns(pattern: { name: string; active: boolean; bar: number }[]) {
    if (pattern.length >= 1) {
      this.patterns[pattern[0].name] = pattern;
    }
  }

  restartPattern() {
    this.bars = Object.values(this.patterns).flat(1);
  }
  start() {
    this.pause = false;
  }
  stop() {
    this.pause = true;
  }
}
