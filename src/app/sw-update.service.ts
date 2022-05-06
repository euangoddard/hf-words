import { ApplicationRef, Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, NEVER, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SwUpdatesService implements OnDestroy {
  private checkInterval = 1000 * 60 * 60 * 6; // 6 hours
  updateActivated: Observable<string>;

  constructor(appRef: ApplicationRef, private readonly swUpdate: SwUpdate) {
    if (!swUpdate.isEnabled) {
      this.updateActivated = NEVER;
      return;
    }

    // Periodically check for updates (after the app is stabilized).
    const appIsStable = appRef.isStable.pipe(first((v) => v));
    concat(appIsStable, interval(this.checkInterval)).subscribe(() =>
      this.swUpdate.checkForUpdate(),
    );

    // Activate available updates.
    this.swUpdate.available.subscribe(() => this.swUpdate.activateUpdate());

    // Notify about activated updates.
    this.updateActivated = this.swUpdate.activated.pipe(map((evt) => evt.current.hash));
  }

  ngOnDestroy(): void {}
}
