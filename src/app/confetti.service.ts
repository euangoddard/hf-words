import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { create as createConfetti, Options } from 'canvas-confetti';

type Confetti = (options?: Options) => Promise<null> | null;

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  private readonly confetti: Confetti;

  constructor(private readonly zone: NgZone, @Inject(DOCUMENT) docRef: Document) {
    const canvas = docRef.createElement('canvas');
    canvas.setAttribute('width', `${window.innerWidth}`);
    canvas.setAttribute('height', `${window.innerHeight}`);
    docRef.body.appendChild(canvas);
    this.confetti = createConfetti(canvas, { resize: true, useWorker: true } as any);
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
}
