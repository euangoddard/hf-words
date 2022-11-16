import { Injectable, NgZone } from '@angular/core';
import { create as createConfetti, Options } from 'canvas-confetti';

type Confetti = (options?: Options) => Promise<null> | null;

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  private readonly confetti: Confetti;

  constructor(private readonly zone: NgZone) {
    this.confetti = createConfetti(null as any, { resize: true, useWorker: true } as any);
  }

  explode(element: HTMLElement): void {
    this.zone.runOutsideAngular(() => {
      const { top, left, width, height } = element.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;

      this.confetti({
        particleCount: 100,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      });
    });
  }

  fireworks(): void {
    this.zone.runOutsideAngular(() => {
      const end = Date.now() + 10 * 1000;
      const interval: any = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        this.confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
        });
      }, 200);
    });
  }
}
