import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tr[appDrum]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td>
      {{ name }}
    </td>
    <td
      *ngFor="let b of bars; index as i"
      class="bar activo"
      [ngClass]="{ active: bar === i }"
    >
      <label class="container">
        <input
          (change)="restartPattern()"
          #inbut
          type="checkbox"
          [name]="name + '_' + i"
        />
        <span class="checkmark"></span>
      </label>
    </td>
  `,
  styles: [
    `
      .bar {
        height: 30px;
      }
      .container {
        display: block;
        position: relative;
        padding-left: 28px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 22px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      /* Hide the browser's default radio button */
      .container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      /* Create a custom radio button */
      .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: #eee;
        border-radius: 50%;
      }

      /* On mouse-over, add a grey background color */
      .container:hover input ~ .checkmark {
        background-color: #ccc;
      }

      /* When the radio button is checked, add a blue background */
      .container input:checked ~ .checkmark {
        background-color: #2196f3;
      }

      /* Create the indicator (the dot/circle - hidden when not checked) */
      .checkmark:after {
        content: '';
        position: absolute;
        display: none;
      }

      /* Show the indicator (dot/circle) when checked */
      .container input:checked ~ .checkmark:after {
        display: block;
      }

      /* Style the indicator (dot/circle) */
      .container .checkmark:after {
        top: 5px;
        left: 5px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
      }
    `,
  ],
})
export class DrumComponent implements OnChanges, AfterViewInit {
  @Input() name: string = 'boom';
  @Input() bar: number | null = 0;
  // @Input() i: number = 0;
  @Input() bars: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  @Input() sound: any;
  pattern: { name: string; active: boolean; bar: number }[] = this.bars.map(
    (i) => ({
      name: this.name,
      active: false,
      bar: i,
    })
  );
  @Output() restart = new BehaviorSubject<
    { name: string; active: boolean; bar: number }[]
  >(this.pattern);
  @ViewChildren('inbut')
  checkBoxRefs!: QueryList<ElementRef<HTMLInputElement>>;

  ngOnChanges(): void {
    if (this.bar && this.pattern[this.bar].active) {
      this.beep();
    }
  }
  beep() {
    const snd = new Audio(location.href + `assets/${this.name}.wav`);
    snd.play();
  }
  ngAfterViewInit(): void {
    this.restartPattern();
  }
  restartPattern() {
    this.pattern = this.checkBoxRefs.map(({ nativeElement }) => {
      const n = nativeElement.name.split('_');
      return {
        name: n[0],
        active: nativeElement.checked,
        bar: Number(n[1]),
      };
    });
    this.restart.next(this.pattern);
  }
}
