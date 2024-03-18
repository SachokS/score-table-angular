import {NgForOf} from "@angular/common";
import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from "@angular/core";
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore} from "@angular/fire/firestore";
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
  firestore: Firestore = inject(Firestore);
  public itemCollection!: any;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.itemCollection = collection(this.firestore, "games");
    collectionData<Game>(this.itemCollection, {idField: "id"}).subscribe(res => {
      this._games = res;
      this.cdr.detectChanges();
    });
  }

  public _createGame(): void {
    this._games.push({
      name: this._gameName,
      id: uuid()
    });
    const docRef = addDoc(collection(this.firestore, "games"), {
      name: this._gameName,
      id: uuid()
    });
    console.log("Document written with ID: ", docRef);
  }

  public _watchGame(gameId: string): void {
    this.router.navigate([`/watch-game/${gameId}`]);
  }

  public _controlGame(gameId: string): void {
    this.router.navigate([`/control-game/${gameId}`]);
  }

  public _deleteGame(gameId: string): void {
    this._games = this._games.filter(game => game.id !== gameId);
    this.cdr.detectChanges();
    const docRef = doc(this.firestore, "games", gameId);
    deleteDoc(docRef).then(() => {
      console.log("Entire Document has been deleted successfully.");
    })
      .catch(error => {
        console.log(error);
      });

  }

  public ngOnDestroy() {

  }
}

export interface Game {
  id: string,
  name: string
}
