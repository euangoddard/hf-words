import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { map, pluck, take, withLatestFrom } from 'rxjs/operators';
import { SwUpdatesService } from 'src/app/sw-update.service';
import { WordsService } from 'src/app/words.service';

@Component({
  selector: 'hfw-root',
  template: `
    <div *alias="letters$ | async as letters">
      <hfw-letter
        *ngFor="let letter of letters; trackBy: trackByLetter"
        [letter]="letter.symbol"
        [done]="letter.done"
        @letterAnimation
      ></hfw-letter>
    </div>
    <input
      class="hidden-capture"
      type="text"
      autofocus
      (input)="handleInput($event)"
      (blur)="refocusCapture($event)"
    />
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('letterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.01)' }),
        animate('0.5s', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [animate('0.5s', style({ opacity: 0, transform: 'scale(0)' }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  readonly trackByLetter = (index: number, letter: Letter) => `${letter.word}:${letter.symbol}`;

  letters$: Observable<Letter[]>;

  private readonly indexSubject = new BehaviorSubject<number>(0);
  private readonly emptySubject = new Subject<string>();

  constructor(
    private readonly wordsService: WordsService,
    private readonly swUpdatesService: SwUpdatesService,
  ) {}

  ngOnInit(): void {
    this.letters$ = combineLatest([
      merge(this.wordsService.word$.pipe(pluck('word')), this.emptySubject),
      this.indexSubject,
    ]).pipe(
      map(([word, index]) => {
        return word.split('').map((letter, i) => {
          return {
            symbol: letter,
            done: i < index,
            word,
          };
        });
      }),
    );
    this.wordsService.refreshWords();
    this.swUpdatesService.updateActivated.subscribe(() => {
      console.log('activated update!');
    });
  }

  handleInput(event: InputEvent): void {
    if (event.data && event.data.trim()) {
      this.captureLetter(event.data.slice(-1).toLowerCase());
    }
  }

  captureLetter(typedLetter: string): void {
    this.letters$.pipe(withLatestFrom(this.indexSubject), take(1)).subscribe(([letters, index]) => {
      const letter = letters[index].symbol;
      if (letter.toLowerCase() === typedLetter) {
        let maxIndex = letters.length - 1;
        if (index < maxIndex) {
          this.indexSubject.next(index + 1);
        } else if (index === maxIndex) {
          this.indexSubject.next(index + 1);
          setTimeout(() => {
            this.emptySubject.next('');
          }, 500);
          setTimeout(() => {
            this.wordsService.next();
            this.indexSubject.next(0);
          }, 1000);
        }
      }
    });
  }

  refocusCapture(event: FocusEvent): void {
    (event.target as HTMLInputElement).focus();
  }
}

interface Letter {
  symbol: string;
  done: boolean;
  word: string;
}
