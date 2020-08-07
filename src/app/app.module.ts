import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SideBarComponent} from "./flight-chain/menu.component";
import {AppComponent} from './app.component';
import {FlightChainComponent} from './flight-chain/flight-chain.component';
import {AppMaterialModule} from "./app-material.module";
import {AppRoutingModule} from './app-routing.module';
import {FlightChainService} from "./flight-chain/flight-chain.service";
import {HttpClientModule} from "@angular/common/http";
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import {MomentModule} from "angular2-moment";
import {NgPipesModule} from "ngx-pipes";
import {FlightChainTransactionComponent} from "./flight-chain-transaction/flight-chain-transaction.component";
import {IdenticonHashDirective} from "./utils/identicon-hash.directive";
import {TruncatePipe} from "./pipes/truncate-pipe";
import {DisplayCodeSearchComponent} from "./flight-chain/displaycode-search.component";
import {FlightChainDashBoardComponent} from "./dashboard/flight-chain-dashboard.component";
import {ArrivalAirportComponent} from "./arrival-airport/arrival-airport.component";
import {DepartureAirportComponent} from "./departure-airport/departure-airport.component";
import {FigurecardComponent} from "./figurecard/figurecard.component";
import {ImagecardComponent} from "./imagecard/imagecard.component";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChartsModule } from 'ng2-charts';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import {environment} from "../environments/environment";
const config: SocketIoConfig = { url: environment.webSocketUrl, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    FlightChainComponent,
    SideBarComponent,
    FlightChainTransactionComponent,
    DisplayCodeSearchComponent,
    IdenticonHashDirective,
    TruncatePipe,
    FlightChainDashBoardComponent,
    ArrivalAirportComponent,
    DepartureAirportComponent,
    FigurecardComponent,
    ImagecardComponent

  
  ],

  imports: [
    HttpClientModule,
    BrowserModule,
    AppMaterialModule,
    AppRoutingModule,
    MomentModule,
    NgPipesModule,
    ChartsModule,
    NgxJsonViewerModule,
    SocketIoModule.forRoot(config),
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF})
  ],
  providers: [FlightChainService,
    {
      provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
    } ],
  
  bootstrap: [AppComponent]
})
export class AppModule {
}
