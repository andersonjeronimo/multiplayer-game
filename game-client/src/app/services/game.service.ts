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
    let observable = Observable.create((observer) => {
      this.socket.on('game-state', (state) => {
        observer.next(state);
      });
      return () => {
        this.socket.disconnect();
      };      
    });
    return observable;
  }

  public getMessages = () => {
    let observable = Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}
