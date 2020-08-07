import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {FlightChainService} from './flight-chain.service';
import {NGXLogger} from 'ngx-logger';
import {HttpErrorResponse} from '@angular/common/http';
import {FlightChainData} from '../acris-schema/AcrisFlightHistoryFromBlockchain';
import * as _ from 'lodash';
import {AcrisFlight} from '../acris-schema/AcrisFlight';
import {ActivatedRoute} from "@angular/router";
import {FlightHistoryResponse} from './FlightHistoryResponse';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-flight-chain',
  templateUrl: './flight-chain.component.html',
  styleUrls: ['./flight-chain.component.css']
})
export class FlightChainComponent implements OnInit {

  /**
   * This contains the current most up to date flight status
   */
  flightLive = null;
  /**
   * This contains the history of all flight changes
   */
  flightHistory = null;
  /**
   * NonNull if there was an error loading the flight data
   */
  error = null;
  loadingFlight = false;
  flightKey = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}[A-Z0-9]{2}[0-9]?/)]);
  private _docSub: Subscription;
  constructor(private route: ActivatedRoute,
              private flightChainService: FlightChainService,
              private _logger: NGXLogger) {
  }

  ngOnInit() {
    this._docSub = this.flightChainService.documents1.subscribe(document => {
      let key = localStorage.getItem('flightChain.flightKey');
      if(key.trim() == document.trim())
      window.location.reload();
    }
    );
    const flightKey: string = this.route.snapshot.paramMap.get('flightKey');
    if (flightKey) {
      localStorage.setItem('flightChain.flightKey', this.flightKey.value);
      this.flightKey.setValue(flightKey);
      this.onClickSearch()
    } else {

      let storedFlightKey = localStorage.getItem('flightChain.flightKey');
      if (!storedFlightKey) {
        storedFlightKey = '';
      }
      this.flightKey.setValue(storedFlightKey);
    }
  }

  public getInputErrorMessage(): string {
    return this.flightKey.hasError('required') ? 'You must enter a value' :
      this.flightKey.hasError('pattern') ? 'Not a valid flight key.' : '';
  }

  onClickSearch() {
    this._logger.debug('onClickSearch ' + this.flightKey.value);

    if (this.flightKey.valid) {
    
      this.resetFlightSearch();
      this.loadingFlight = true;
      localStorage.setItem('flightChain.flightKey', this.flightKey.value);
      this.flightChainService.getFlightHistory(this.flightKey.value)
        .subscribe((flights: FlightHistoryResponse[]) => {
          this.handleLoadedFlightHistory(flights);
        });
    }
  }

  private handleLoadedFlightHistory(flights: FlightHistoryResponse[]) {
    this._logger.info('getFlightResult: ', flights);

    if (flights instanceof HttpErrorResponse || flights.length === 0) {
      this.error = flights;
    } else {
      const flightsData: any[] = [];
      for (const flight of flights) {
        flightsData.push(flight.flightData);
      }
      /*if (!this.isAcrisFlight(flights[0].flightData)) {
        this.error = 'Not a valid ACRIS Flight response';
        this.flightHistory = null;
      } else {*/
        this.flightLive = flights[0];
        this._logger.info('Flight Live: ', this.flightLive );
        this.flightHistory = flights; //this.processFlightsHistory(flights);
        this.error = null;
     // }
    }
    this.loadingFlight = false;
  }

  getErrorMessage(): string {
    if (!this.error)
      return null;

    if (this.error instanceof HttpErrorResponse) {
      return this.error.message;
    }

    console.log('unknown error', this.error);
    return 'Unknown error';
  }

  getCodeName(code:string){

    let codeArray: { [key: string]: string; } = {}; 

    codeArray["SH"] = "Scheduled";
    codeArray["RS"] = "Return to stand";
    codeArray["ES"] = "Provisional estimated operating time";
    codeArray["EX"] = "Confirmed expected operating time";
    codeArray["NI"] = "Next information";
    codeArray["CK"] = "Check in started";
    codeArray["GO"] = "Gate Opened";
    codeArray["BD"] = "Boarding started";
    codeArray["LC"] = "Last call to gate";
    codeArray["GC"] = "Gate closed";
    codeArray["TX"] = "Taxi";
    codeArray["AB"] = "Airborne";
    codeArray["CX"] = "Cancelled";
    codeArray["**"] = "Expired";

    codeArray["??"] = "Indeterminate status";

    codeArray["SH"] = "Scheduled"; 
    codeArray["DV"] = "Diverted" ;
    codeArray["ES"] = "Provisional estimated operating time";
    codeArray["EX"] = "Confirmed expected operating time" ;
    codeArray["NI"] = "Next information" ;
    codeArray["OS"] = "Overshoot" ;
    codeArray["ZN"] = "Aircraft entered the radar zone" ;
    codeArray["FS"] = "Aircraft on final approach" ;
    codeArray["LD"] = "Landed" ;
    codeArray["OC"] = "Landed and on-chocks" ;
    codeArray["FB"] = "Landed and the first passenger’s bag is loaded onto the baggage reclaim unit";
    codeArray["LB"] = "Landed and the last passenger’s bag is loaded onto the baggage reclaim unit"; 
    codeArray["CX"] = "Cancelled" ;
    codeArray["**"] = "Expired";
    
    return (codeArray[code]);
  }


  private resetFlightSearch() {
    this.error = null;
    this.flightHistory = null;
  }

  /**
   * Return true if this flight is a valid acris flight (it might be a HttpErrorResponse)
   * @param flight
   */
  private isAcrisFlight(flight: any) {
    return flight !== undefined && flight !== undefined && flight.departureAirport !== undefined;
  }
}
