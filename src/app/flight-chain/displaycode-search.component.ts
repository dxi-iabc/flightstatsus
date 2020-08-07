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

@Component({
  selector: 'app-code-search',
  templateUrl: './displaycode-search.component.html',
  styleUrls: ['./displaycode-search.component.css']
})
export class DisplayCodeSearchComponent implements OnInit {

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
  displayIdentifier = new FormControl('');
  iatacode = new FormControl('');
  constructor(private route: ActivatedRoute,
              private flightChainService: FlightChainService,
              private _logger: NGXLogger) {
  }

  ngOnInit() {


  }

  public getInputErrorMessage(): string {
    return this.displayIdentifier.hasError('required') || this.iatacode.hasError('required') ? 'You must enter a value' :"" ;

  }

  onClickSearch() {
    this._logger.debug('onClickSearch ' + this.displayIdentifier.value);
    if (this.displayIdentifier.valid) {
      let identifier = this.displayIdentifier.value;
      let iatcode = this.iatacode.value;
    
      this.resetFlightSearch();
      this.loadingFlight = true;
      this.flightChainService.getDetailsByCodey(identifier ,iatcode)
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
      const flightsData: FlightChainData[] = [];
      for (const flight of flights) {
        flightsData.push(flight.flightData);
      }
      if (!this.isAcrisFlight(flights[0].flightData)) {
        this.error = 'Not a valid ACRIS Flight response';
        this.flightHistory = null;
      } else {
        this.flightLive = flights[0];
        this.flightHistory = flights; //this.processFlightsHistory(flights);
        this.error = null;
      }
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

  private resetFlightSearch() {
    this.error = null;
    this.iatacode.setValue ("");
    this.displayIdentifier.setValue("");
  }

  /**
   * Return true if this flight is a valid acris flight (it might be a HttpErrorResponse)
   * @param flight
   */
  private isAcrisFlight(flight: any) {
    return flight !== undefined && flight !== undefined && flight.departureAirport !== undefined;
  }
}
