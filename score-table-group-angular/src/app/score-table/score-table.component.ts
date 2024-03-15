import {NgForOf} from "@angular/common";
import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
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

  private broadCastChanel!: BroadcastChannel;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log("Test ID:", params["id"]);
      if (this.pure) {
        this.broadCastChanel = new BroadcastChannel("game-" + params["id"]);

        this.broadCastChanel.onmessage = (message) => {
          console.log(message.data);
          this.firstTeamName = message.data.firstTeamName;
          this.secondTeamName = message.data.secondTeamName;
          this.firstTeamSetScore = message.data.firstTeamSetScore;
          this.secondTeamSetScore = message.data.secondTeamSetScore;
          this.firstTeamScore = message.data.firstTeamScore;
          this.secondTeamScore = message.data.secondTeamScore;
          this.firstTeamServing = message.data.firstTeamServing;
          this.set = message.data.set;
          this.cdr.detectChanges();
        };
      }
    });
  }

  ngOnDestroy() {
    this.broadCastChanel?.close();
  }

}

