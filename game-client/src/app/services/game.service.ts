import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private socket: Socket) { }

  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }

  public sendCommand(command) {
    this.socket.emit('new-command', command);
  }

  public getState = () => {
    return Observable.create((observer) => {
      this.socket.on('game-state', (state) => {
        observer.next(state);
      });
    });
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

}
