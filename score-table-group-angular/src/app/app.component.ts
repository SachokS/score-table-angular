import {Component} from "@angular/core";
import {RouterModule, RouterOutlet} from "@angular/router";
import {GamesListComponent} from "./games-list/games-list.component";
import {ScoreTableWithControlsComponent} from "./score-table-with-controls/score-table-with-controls.component";
import {ScoreTableComponent} from "./score-table/score-table.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ScoreTableComponent, GamesListComponent, ScoreTableWithControlsComponent, RouterModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.less"
})
export class AppComponent {
  title = "score-table-group-angular";
}
