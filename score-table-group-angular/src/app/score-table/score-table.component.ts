import {NgForOf} from "@angular/common";
import {ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit} from "@angular/core";
import {collection, deleteDoc, doc, Firestore, onSnapshot, query, where} from "@angular/fire/firestore";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-score-table",
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: "./score-table.component.html",
  styleUrl: "./score-table.component.less"
})
export class ScoreTableComponent implements OnInit, OnDestroy {
  @Input() public firstTeamName: string = "";
  @Input() public secondTeamName: string = "";
  @Input() public firstTeamSetScore: number = 0;
  @Input() public secondTeamSetScore: number = 0;
  @Input() public firstTeamScore: number[] = [];
  @Input() public secondTeamScore: number[] = [];
  @Input() public set: number = 1;
  @Input() public firstTeamServing: boolean = true;
  @Input() public pure: boolean = true;

  firestore: Firestore = inject(Firestore);
  private documentId: string = "";

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (this.pure) {
        const q = query(collection(this.firestore, "live-score"),
          where("gameId", "==", params["id"]));
        onSnapshot(q, docsSnap => {
          docsSnap.forEach(doc => {
            this.documentId = doc.id;
            const gameData = doc.data() as any;
            this.firstTeamName = gameData.firstTeamName;
            this.secondTeamName = gameData.secondTeamName;
            this.firstTeamSetScore = gameData.firstTeamSetScore;
            this.secondTeamSetScore = gameData.secondTeamSetScore;
            this.firstTeamScore = gameData.firstTeamScore;
            this.secondTeamScore = gameData.secondTeamScore;
            this.firstTeamServing = gameData.firstTeamServing;
            this.set = gameData.set;
            this.cdr.detectChanges();
          });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.pure) {
      const docRef = doc(this.firestore, "live-score", this.documentId);
      deleteDoc(docRef).then(() => {
        console.log("Entire Document has been deleted successfully.");
      })
        .catch(error => {
          console.log(error);
        });
    }
  }

}

