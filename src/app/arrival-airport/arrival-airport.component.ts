import { Component ,OnInit,Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import {FlightChainData} from '../acris-schema/AcrisFlightHistoryFromBlockchain';
import {FlightChainService} from "../flight-chain/flight-chain.service";
@Component({
  selector: 'app-arrival-airport',
  templateUrl: './arrival-airport.component.html',
  styleUrls: ['./arrival-airport.component.css']
})

export class ArrivalAirportComponent implements OnInit{

  formControl = new FormControl(new Date());
  ngModelDate = new Date();
  flights: any;   // IFlightChainData[];


  public pieChartOptions1: ChartOptions = {
    responsive: true,
  };

  public pieChartLabelsArrival: Label[] = ['LGW', 'LHR', 'PVG', 'AMS', 'FRA'];
  public pieChartDataArrival: SingleDataSet = [0, 0, 0, 0, 0, 0];
  public pieChartTypeArrival: ChartType = 'pie';
  public pieChartLegendArrival = true;
  public pieChartPluginsArrival = [];


  title = 'app';
  public pieChartLabels:string[] = ["Pending", "InProgress", "OnHold", "Complete", "Cancelled"];
  public pieChartData:number[] = [21, 39, 10, 14, 16];
  public pieChartType:string = 'pie';
  public pieChartOptions:any = {'backgroundColor': [
                                                       "#fff",
                                                       "#4BC0C0",
                                                       "#FFCE56",
                                                       "#E7E9ED",
                                                       "#36A2EB"
                                                    ]};
 
  // events on slice click
  public chartClicked(e:any):void {
    console.log(e);
  }
 
 // event on pie chart slice hover
  public chartHovered(e:any):void {
    console.log(e);
  }


  constructor(private flightChainService: FlightChainService) {

   }

   airportAcrisData(flight:any){

    
   }

   loadFlights() {
    // TODO refactor this to use a service
    this.flightChainService.getWorldStates()
    .subscribe((flights: any[]) => {
  
    const arrivalAirport: { [airportCode: string]: number; } = {};
    for (const flight of flights) {

      if(flight.acrisType == "airport"){


        if(flight.flightData.AircraftMovement.ArrivalOrDeparture == "A") {

          let airportCode =flight.flightData.AirportFacility.IATAIdentifier;
          if (airportCode in arrivalAirport) {
            arrivalAirport[airportCode]++;
          } else {
            arrivalAirport[airportCode] = 1;
          }
  
        }

        if(flight.flightData.AircraftMovement.ArrivalOrDeparture == "D") {

          let airportCode =flight.flightData.AircraftMovement.FlightOriginOrDestination;
          if (airportCode in arrivalAirport) {
            arrivalAirport[airportCode]++;
          } else {
            arrivalAirport[airportCode] = 1;
          }
  
        }
  
      }
      
   
    }
    const sortedArrivalAirportKeys = Object.keys(arrivalAirport).sort((a, b) => {
      return arrivalAirport[b] - arrivalAirport[a];
    }).slice(0, 10);


    this.pieChartLabelsArrival = sortedArrivalAirportKeys;

    const sortedArrivalAirportValue: number[] = [];

    for (const item of sortedArrivalAirportKeys) {
      sortedArrivalAirportValue.push(arrivalAirport[item]);
    }
    this.pieChartDataArrival = sortedArrivalAirportValue;
     console.log("---------------,chart data",sortedArrivalAirportValue)

  });

  }

  ngOnInit() {
    //this.loadFlights();
    this.loadViewFlights();
  }



  loadViewFlights() {
    // TODO refactor this to use a service
    this.flightChainService.getArrvCountView()
    .subscribe((data: any) => {
  
    const arrivalAirport: { [airportCode: string]: number; } = {};
    for (let i=0;i< data.rows.length;i++) {

      arrivalAirport[data.rows[i].key[0]]= data.rows[i].value;
      

     
     }
    const sortedArrivalAirportKeys = Object.keys(arrivalAirport).sort((a, b) => {
      return arrivalAirport[b] - arrivalAirport[a];
    }).slice(0, 10);


    this.pieChartLabelsArrival = sortedArrivalAirportKeys;

    const sortedArrivalAirportValue: number[] = [];

    for (const item of sortedArrivalAirportKeys) {
      sortedArrivalAirportValue.push(arrivalAirport[item]);
    }
    this.pieChartDataArrival = sortedArrivalAirportValue;
     console.log("---------------,chart data",sortedArrivalAirportValue)

  });

  }



  getWorldStates(): void {
   
  }

}
