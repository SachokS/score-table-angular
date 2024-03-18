import {Component, inject, OnInit} from "@angular/core";
import {addDoc, collection, doc, Firestore, setDoc} from "@angular/fire/firestore";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {debounceTime, distinctUntilChanged, filter} from "rxjs";
import {ScoreTableComponent} from "../score-table/score-table.component";

@Component({
  selector: "app-score-table-with-controls",
  standalone: true,
  imports: [
    ScoreTableComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./score-table-with-controls.component.html",
  styleUrl: "./score-table-with-controls.component.less"
})
export class ScoreTableWithControlsComponent implements OnInit {
  public firstTeamName: string = "";
  public secondTeamName: string = "";
  public firstTeamSetScore: number = 0;
  public secondTeamSetScore: number = 0;
  public firstTeamScore: number[] = [0];
  public secondTeamScore: number[] = [0];
  public set: number = 0;
  public _firstTeamServing: boolean = true;

  public firstTeamNameControl = new FormControl("", {nonNullable: true});
  public secondTeamNameControl = new FormControl("", {nonNullable: true});

  public _servingForm = new FormGroup({
    serving: new FormControl(false, {nonNullable: true})
  });
  firestore: Firestore = inject(Firestore);
  private gameId: string = "";
  private documentId: string = "";

  constructor(private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameId = params["id"];
      collection(this.firestore, "live-score");
      addDoc(collection(this.firestore, "live-score"), {
        gameId: params["id"]
      }).then(document => {
        this.documentId = document.id;
      });
    });

    this.firstTeamNameControl.valueChanges
      .pipe(filter(value => !!value),
        debounceTime(500),
        distinctUntilChanged())
      .subscribe((res) => {
        this.firstTeamName = res;
        this.updateGameInfo();
      });

    this.secondTeamNameControl.valueChanges
      .pipe(filter(value => !!value),
        debounceTime(500),
        distinctUntilChanged())
      .subscribe((res) => {
        this.secondTeamName = res;
        this.updateGameInfo();
      });

    this._servingForm.valueChanges
      .subscribe((res) => {
        this._firstTeamServing = !!res.serving;
        this.updateGameInfo();
      });
  }

  public _firstTeamScorePlus(): void {
    this.firstTeamScore[this.set]++;
    if (this.set === 5) {
      if (this.firstTeamScore[this.set] >= 15 && this.firstTeamScore[this.set] - 2 >= this.secondTeamScore[this.set]) {
        this.firstTeamSetScore++;
      }
    } else {
      if (this.firstTeamScore[this.set] >= 25 && this.firstTeamScore[this.set] - 2 >= this.secondTeamScore[this.set]) {
        this.firstTeamSetScore++;
        this.set++;
        this.firstTeamScore[this.set] = 0;
        this.secondTeamScore[this.set] = 0;
      }
    }

    this.updateGameInfo();
  }

  public _firstTeamScoreMinus(): void {
    this.firstTeamScore[this.set]--;

    this.updateGameInfo();
  }

  public _secondTeamScorePlus(): void {
    this.secondTeamScore[this.set]++;
    if (this.set === 5) {
      if (this.secondTeamScore[this.set] >= 15 && this.secondTeamScore[this.set] - 2 >= this.firstTeamScore[this.set]) {
        this.secondTeamSetScore++;
      }
    } else {
      if (this.secondTeamScore[this.set] >= 25 && this.secondTeamScore[this.set] - 2 >= this.firstTeamScore[this.set]) {
        this.secondTeamSetScore++;
        this.set++;
        this.firstTeamScore[this.set] = 0;
        this.secondTeamScore[this.set] = 0;
      }
    }
    this.updateGameInfo();
  }

  public _secondTeamScoreMinus(): void {
    this.secondTeamScore[this.set]--;
    this.updateGameInfo();
  }

  private updateGameInfo(): void {
    const docRef = doc(this.firestore, "live-score", this.documentId);
    const data = {
      gameId: this.gameId,
      firstTeamScore: this.firstTeamScore,
      secondTeamScore: this.secondTeamScore,
      set: this.set,
      firstTeamSetScore: this.firstTeamSetScore,
      secondTeamSetScore: this.secondTeamSetScore,
      secondTeamName: this.secondTeamName,
      firstTeamName: this.firstTeamName,
      firstTeamServing: this._firstTeamServing
    };

    setDoc(docRef, data)
      .then(docRef => {
        console.log("Entire Document has been updated successfully");
      })
      .catch(error => {
        console.log(error);
      });
  }
}
