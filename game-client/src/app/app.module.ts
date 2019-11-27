import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// game
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { GameComponent } from './components/game/game.component';
import { GameService } from './services/game.service';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
// game

@NgModule({
  declarations: [
    AppComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
