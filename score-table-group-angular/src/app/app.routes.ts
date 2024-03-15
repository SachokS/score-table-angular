import {Routes} from "@angular/router";
import {GamesListComponent} from "./games-list/games-list.component";
import {ScoreTableWithControlsComponent} from "./score-table-with-controls/score-table-with-controls.component";
import {ScoreTableComponent} from "./score-table/score-table.component";

export const routes: Routes = [
  {path: "", component: GamesListComponent},
  {path: "watch-game/:id", component: ScoreTableComponent},
  {path: "control-game/:id", component: ScoreTableWithControlsComponent},
  {path: "**", redirectTo: "", pathMatch: "full"}
];
