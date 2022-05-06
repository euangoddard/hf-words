import { Injectable } from '@angular/core';
import { shuffle } from 'lodash-es';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

const WORDS = [
  "I'm",
  'I',
  "don't",
  "it's",
  'Mr',
  'Mrs',
  'a',
  'about',
  'all',
  'an',
  'and',
  'are',
  'as',
  'asked',
  'at',
  'back',
  'be',
  'big',
  'but',
  'by',
  'called',
  'could',
  'came',
  'can',
  'children',
  'come',
  'dad',
  'day',
  'do',
  'down',
  'for',
  'from',
  'get',
  'go',
  'got',
  'had',
  'have',
  'he',
  'help',
  'her',
  'here',
  'him',
  'his',
  'house',
  'if',
  'in',
  'into',
  'is',
  'it',
  'just',
  'like',
  'little',
  'look',
  'looked',
  'make',
  'made',
  'me',
  'mum',
  'my',
  'no',
  'not',
  'now',
  'of',
  'oh',
  'old',
  'on',
  'one',
  'out',
  'people',
  'put',
  'said',
  'saw',
  'see',
  'she',
  'so',
  'some',
  'that',
  'the',
  'their',
  'them',
  'then',
  'that',
  'there',
  'they',
  'this',
  'time',
  'to',
  'too',
  'up',
  'very',
  'was',
  'we',
  'went',
  'were',
  'what',
  'when',
  'will',
  'with',
  'you',
  'your',
] as const;

interface WordData {
  word: string;
  index: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private readonly wordsSubject = new ReplaySubject<readonly string[]>(1);
  private readonly indexSubject = new ReplaySubject<number>(1);
  private readonly nextSubject = new Subject<void>();

  readonly word$: Observable<WordData>;

  constructor() {
    this.nextSubject.pipe(withLatestFrom(this.indexSubject)).subscribe(([_, index]) => {
      if (index < WORDS.length) {
        this.indexSubject.next(index + 1);
      }
    });

    this.word$ = combineLatest([this.wordsSubject, this.indexSubject]).pipe(
      map(([words, index]) => {
        return {
          word: words[index] || '',
          index,
          total: words.length,
        };
      }),
    );
  }

  refreshWords(): void {
    this.wordsSubject.next(shuffle(WORDS));
    this.indexSubject.next(0);
  }

  next(): void {
    this.nextSubject.next();
  }
}
