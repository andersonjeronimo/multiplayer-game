import { Component, HostListener, ViewChild, ElementRef, OnInit, NgZone, OnDestroy } from '@angular/core';

export enum KEY_CODE {
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
  UP_ARROW = 38,
  DOWN_ARROW = 40
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'game-client';
  requestId;
  interval;

  game = {
    players: [
      {
        id: 'player1',
        x: 1,
        y: 1
      }
    ]
  }

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');    
    this.ngZone.runOutsideAngular(() => this.renderGame());
    setInterval(() => {
      this.renderGame();
    }, 200);
  }

  constructor(private ngZone: NgZone) { }
 
  renderGame() {    
    const canvas = this.context.canvas;
    this.game.players.map(player => {
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.context.fillStyle = 'blue';
      this.context.fillRect(player.x, player.y, 10, 10);
    });
    this.requestId = requestAnimationFrame(() => this.renderGame);
  }
  
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    //lista de códigos das teclas
    //https://keycode.info/
    this.broadcastKeyCode(event.keyCode);    
  }

  broadcastKeyCode(code) {
    this.animatePlayer(code, this.game.players[0]);
  }

  animatePlayer(keyCode, player) {    
    if (keyCode === KEY_CODE.LEFT_ARROW) {
      player.x -= 2;
    }
    if (keyCode === KEY_CODE.RIGHT_ARROW) {
      player.x += 2;
    }
    if (keyCode === KEY_CODE.UP_ARROW) {
      player.y -= 2;
    }
    if (keyCode === KEY_CODE.DOWN_ARROW) {
      player.y += 2;
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }


}
