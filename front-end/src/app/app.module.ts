import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AppSocket } from './socket.service';
import { InQuePipe } from './inQue.pipe';
@NgModule({
  declarations: [
    AppComponent,
    InQuePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatCheckboxModule
  ],
  providers: [AppSocket],
  bootstrap: [AppComponent]
})
export class AppModule { }
