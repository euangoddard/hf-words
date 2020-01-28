import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxAliasModule } from 'ngx-alias';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LetterComponent } from './letter/letter.component';

@NgModule({
  declarations: [AppComponent, LetterComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxAliasModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
