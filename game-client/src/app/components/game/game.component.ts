import { Component, HostListener, ViewChild, ElementRef, OnInit, NgZone, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D;
  public title = 'My First Multiplayer Game';
  private requestId;
  private interval;

  private stateSub: Subscription; 
  private messagesSub: Subscription;
  message: string;
  messages: string[] = [];
  game: any = {};

  constructor(private service: GameService, private ngZone: NgZone) { }

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');   
    this.ngZone.runOutsideAngular(() => this.renderScreen());
    setInterval(() => {
      this.renderScreen();
    }, 100);

    this.messagesSub = this.service
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });

    this.stateSub = this.service
      .getState()
      .subscribe((state) => {
        this.game = state;
      });
  }

  sendMessage() {
    this.service.sendMessage(this.message);
    this.message = '';
  }
  
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    // const command = { keyCode: event.keyCode };    
    const command = { key: event.key };
    this.service.sendCommand(command);
  }
  
    renderScreen() {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      for (const index in this.game) {
        const player = this.game[index];
        this.context.fillStyle = player.color;
        this.context.fillRect(player.x, player.y, 20, 20);
      }
      this.requestId = requestAnimationFrame(() => this.renderScreen);
    }  

  ngOnDestroy() {
    this.stateSub.unsubscribe();
    this.messagesSub.unsubscribe();
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  //https://opengameart.org/content/a-pixel-art-collection
  //https://keycode.info/

}
