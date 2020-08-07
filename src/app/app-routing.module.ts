import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlightChainComponent} from "./flight-chain/flight-chain.component";
import {DisplayCodeSearchComponent} from "./flight-chain/displaycode-search.component";
import {SideBarComponent} from "./flight-chain/menu.component";
import {FlightChainTransactionComponent} from "./flight-chain-transaction/flight-chain-transaction.component";
import {FlightChainDashBoardComponent} from "./dashboard/flight-chain-dashboard.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component:FlightChainDashBoardComponent},
  {path: 'menu', component: SideBarComponent},
  {path: 'flight', component: FlightChainComponent},
  {path: 'codesearch', component: DisplayCodeSearchComponent},
  {path: 'flight/:flightKey', component: FlightChainComponent},
  { path: 'transaction/:transactionId', component: FlightChainTransactionComponent },
  // { path: 'heroes', component: HeroesComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
