import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxAliasModule } from 'ngx-alias';
import { AppComponent } from './app.component';
import { LetterComponent } from './letter/letter.component';

@NgModule({
  declarations: [AppComponent, LetterComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgxAliasModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
