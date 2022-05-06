import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfettiService } from 'src/app/confetti.service';

@Component({
  selector: 'hfw-letter',
  template: ` <span [class.done]="done">{{ letter }}</span> `,
  styleUrls: ['./letter.component.scss'],
})
export class LetterComponent implements OnChanges {
  @Input() letter!: string;
  @Input() done: boolean = false;

  private readonly element: HTMLElement;

  constructor(private readonly confetti: ConfettiService, elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    const doneChange = changes['done'];
    if (doneChange && doneChange.currentValue && !doneChange.previousValue) {
      this.confetti.explode(this.element);
    }
  }
}
