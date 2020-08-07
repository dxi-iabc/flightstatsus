import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import {FlightChainData} from '../acris-schema/AcrisFlightHistoryFromBlockchain';
import {FlightChainService} from "../flight-chain/flight-chain.service";

@Component({
  selector: 'app-departure-airport',
  templateUrl: './departure-airport.component.html',
  styleUrls: ['./departure-airport.component.css']
})
export class DepartureAirportComponent {

  formControl = new FormControl(new Date());
  ngModelDate = new Date();
  flights: any;     // IFlightChainData[];
 
  constructor(private flightChainService: FlightChainService) { 
     
    //this.loadFlights() ;
    this.loadViewFlights()

  }

  

    public chartClicked(e:any):void {
      console.log(e);
    }
   
  
    public chartHovered(e:any):void {
      console.log(e);
    }
  
    public pieChartType:string = 'pie';
    public pieChartOptions:any = {  responsive: true,'backgroundColor': [
                                                         "#fff",
                                                         "#4BC0C0",
                                                         "#FFCE56",
                                                         "#E7E9ED",
                                                         "#36A2EB"
                                                      ]};
  public pieChartLabelsDeparture: Label[] = ['GVA', 'LHR', 'CDG', 'AMS', 'FRA'];
  public pieChartDataDeparture: SingleDataSet = [60, 150, 31, 76, 56];
  public pieChartTypeDeparture: ChartType = 'pie';
  public pieChartLegendDeparture = true;
  public pieChartPluginsDeparture = [];


  async loadFlights() {
   this.flightChainService.getWorldStates()
    .subscribe((flights: any[]) => {


      const DepartureAirport: { [airportCode: string]: number; } = {};
      for (const flight of flights) {

        if(flight.acrisType == "airport"){


          if(flight.flightData.AircraftMovement.ArrivalOrDeparture == "D") {
  
            let airportCode =flight.flightData.AirportFacility.IATAIdentifier;

            if (airportCode in DepartureAirport) {
              DepartureAirport[airportCode]++;
            } else {
              DepartureAirport[airportCode] = 1;
            }
    
          }

          
          if(flight.flightData.AircraftMovement.ArrivalOrDeparture == "A") {
  
            let airportCode =flight.flightData.AircraftMovement.FlightOriginOrDestination;

            if (airportCode in DepartureAirport) {
              DepartureAirport[airportCode]++;
            } else {
              DepartureAirport[airportCode] = 1;
            }
    
          }
    
        }
       if(flight.acrisType == "airline"){
         
            if (flight.flightData.departureAirport in DepartureAirport) {
              DepartureAirport[flight.flightData.departureAirport]++;
            } else {
              DepartureAirport[flight.flightData.departureAirport] = 1;
            }

      }
      }
      const sortedDepartureAirportKeys = Object.keys(DepartureAirport).sort( (a, b) => {
        return DepartureAirport[b] - DepartureAirport[a];
      }).slice(0, 10);
  
  
      this.pieChartLabelsDeparture = sortedDepartureAirportKeys;
  
      const sortedDepartureAirportValue: number[] = [];
  
      for (const item of sortedDepartureAirportKeys) {
        sortedDepartureAirportValue.push(DepartureAirport[item]);
      }
      this.pieChartDataDeparture = sortedDepartureAirportValue;
   
  });
}


async loadViewFlights() {
  this.flightChainService.getDeptCountView()
   .subscribe((data: any) => {


     const DepartureAirport: { [airportCode: string]: number; } = {};
     for (let i=0;i< data.rows.length;i++) {

      DepartureAirport[data.rows[i].key[0]]= data.rows[i].value;
      

     
     }
     const sortedDepartureAirportKeys = Object.keys(DepartureAirport).sort( (a, b) => {
       return DepartureAirport[b] - DepartureAirport[a];
     }).slice(0, 10);
 
 
     this.pieChartLabelsDeparture = sortedDepartureAirportKeys;
 
     const sortedDepartureAirportValue: number[] = [];
 
     for (const item of sortedDepartureAirportKeys) {
       sortedDepartureAirportValue.push(DepartureAirport[item]);
     }
     this.pieChartDataDeparture = sortedDepartureAirportValue;
  
 });
}



}
