import {NgForOf} from "@angular/common";
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {v4 as uuid} from "uuid";

@Component({
  selector: "app-games-list",
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: "./games-list.component.html",
  styleUrl: "./games-list.component.less"
})
export class GamesListComponent implements OnDestroy, OnInit {
  public _games: Game[] = [];
  public _gameName: string = "";
  private broadCastChannel = new BroadcastChannel("gameList");
  private interval!: any;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.broadCastChannel.onmessage = (message => {
      this._games = message.data;
      this.cdr.detectChanges();
    });

    this.interval = setInterval(() => {
      this.broadCastChannel.postMessage(this._games);
    }, 10000);
  }

  public _createGame(): void {
    this._games.push({
      name: this._gameName,
      id: uuid()
    });
    this.broadCastChannel.postMessage(this._games);
  }

  public _watchGame(gameId: string): void {
    this.router.navigate([`/watch-game/${gameId}`]);

  }

  public _controlGame(gameId: string): void {
    this.router.navigate([`/control-game/${gameId}`]);
  }

  public _deleteGame(gameId: string): void {
    this._games = this._games.filter(game => game.id !== gameId);
    this.broadCastChannel.postMessage(this._games);
    this.cdr.detectChanges();
  }

  public ngOnDestroy() {
    this.broadCastChannel.close();
    clearInterval(this.interval);
    this.interval = null;
  }
}

interface Game {
  id: string,
  name: string
}
