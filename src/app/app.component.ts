import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { tap } from 'rxjs';
import { BeatService } from './beat.service';
import { DrumComponent } from './drum/drum.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, DrumComponent],
})
export class AppComponent implements AfterViewInit {
  beat = inject(BeatService);
  instruments: string[] = this.beat.instruments;
  bpm = this.beat.bpm;
  sound!: { name: string; active: boolean; bar: number };
  tones: { name: string; active: boolean; bar: number }[] = [];
  bar = 0;

  mach$ = this.beat.takt$;
  // .pipe(
  //   tap((data) => console.table(data)),
  //   tap((d) => {
  //     this.bar = d.bar;
  //   }),
  //   tap((s) => (this.sound = s))
  // )
  // .subscribe();

  restart(pattern: { name: string; active: boolean; bar: number }[]) {
    // console.table(pattern);
    if (pattern.length >= 1) {
      this.beat.updatePatterns(pattern);
      this.getTones();
    }
  }

  ngAfterViewInit(): void {
    this.getTones();
  }
  beatChange(e: Event) {
    this.bpm = Number((e.target as HTMLInputElement).value);
    console.log(this.bpm);
    this.getTones();
  }
  getTones() {
    this.beat.restartPattern();

    this.beat.bpmSub.next(this.bpm);
  }
}
