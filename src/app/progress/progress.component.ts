import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isNumber } from 'lodash-es';

@Component({
  selector: 'hfw-progress',
  template: `
    <div>{{ correct }} of {{ total }}</div>
    <div class="track">
      <div class="track-bar" [ngClass]="colorClass" [style.width.%]="percentage"></div>
    </div>
  `,
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent implements OnChanges {
  @Input() correct: number;
  @Input() total: number;

  percentage: number;
  colorClass: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (isNumber(this.correct) && isNumber(this.total)) {
      this.percentage = (100 * this.correct) / this.total;
      this.colorClass = this.getColorClass();
    }
  }

  private getColorClass(): string {
    const steps = 7;
    const breakpoint = 100 / steps;
    if (this.percentage < breakpoint) {
      return 'track-bar--col-1';
    } else if (this.percentage < 2 * breakpoint) {
      return 'track-bar--col-2';
    } else if (this.percentage < 3 * breakpoint) {
      return 'track-bar--col-3';
    } else if (this.percentage < 4 * breakpoint) {
      return 'track-bar--col-4';
    } else if (this.percentage < 5 * breakpoint) {
      return 'track-bar--col-5';
    } else if (this.percentage < 6 * breakpoint) {
      return 'track-bar--col-6';
    } else {
      return 'track-bar--col-7';
    }
  }
}
