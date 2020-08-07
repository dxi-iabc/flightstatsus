import {Component, OnInit,ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FlightChainService} from "../flight-chain/flight-chain.service";
import {Observable, of} from 'rxjs';
import {AcrisFlight} from '../acris-schema/AcrisFlight';
import {catchError, mergeMap, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';


import * as _ from 'lodash';
import {ArrivalAirportComponent} from "../arrival-airport/arrival-airport.component";
import {FlightHistoryResponse} from '../flight-chain/FlightHistoryResponse';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { KeyOptions } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
export class GraphData {
  
  constructor(  public timestamp: string,
    public status: string){
     
  }

  public setData( timestamp: string,
     status: string){
       this.status = status;
       this.timestamp = timestamp ;
    
  }

}

export class TableData{

  public flightKey:string;
  public operatingAirline:string;
  public updaterId:string;
  public passengercount:string;
  public airportrunway:string;
  public status:string;
  public type:string;
  constructor(){

  }


}


@Component({
  selector: 'app-flight-chain-dashboard',
  templateUrl: './flight-chain-dashboard.component.html',
  styleUrls: ['./flight-chain-dashboard.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class FlightChainDashBoardComponent implements OnInit {

  public flightKeyTimeSeries: { [airportCode: string]: any[]; } = {};
  public flightKeyStatusValues: { [airlineCode: string]: number[]; } = {};

  public airlineName: { [key: string]: string; } = {};
  flights:any[];
  rowHeight:string= "450px";
  public totalSheduled :number = 0;
  public totalDep : number = 0;
  public totalLanded: number = 0;
  public totalFinished: number = 0;

  public barChartData:any[]  = new Array<any>();
  private _docSub: Subscription;

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: false
  };

    public mbarChartLabels:string[] = ['Sheduled', 'Boarding','Departed', 'Landed', 'Finished'];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;
  
    public barChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(105,159,177,0.2)',
      borderColor: 'rgba(105,159,177,1)',
      pointBackgroundColor: 'rgba(105,159,177,1)',
      pointBorderColor: '#fafafa',
      pointHoverBackgroundColor: '#fafafa',
      pointHoverBorderColor: 'rgba(105,159,177)'
    },
    { 
      backgroundColor: 'rgba(77,20,96,0.3)',
      borderColor: 'rgba(77,20,96,1)',
      pointBackgroundColor: 'rgba(77,20,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,20,96,1)'
    }
  ];
public barChartData1:any[] = [
      {data: [0, 0, 0, 0,0], label: 'BA'}
];
  
public chartClicked(e:any):void {
 // console.log(e);
}

public chartHovered(e:any):void {
  //console.log(e);
}


  transactionInfo = null;
  displayedColumns: string[] = ['flightKey','operatingAirline', 'updaterId', 'passengercount','type', 'airportrunway' ,'status'];
  dataSource :TableData[];

  constructor(private route: ActivatedRoute,
              private flightChainService: FlightChainService,
              private _logger: NGXLogger) {
                this.getWorldStates();
  }

  ngOnInit() {
    
     this.flightChainService.getTableView().subscribe((data)=>{
console.log("-------------table-----------",data.rows)
       this.dataSource = new Array<TableData>(data.rows.length);
      
       for(let i=0;i< data.rows.length ;i++){
        this.dataSource[i]  = new TableData() ;
   //  console.log("-------",data.rows[i].value)
        this.dataSource[i].flightKey        =  data.rows[i].value.flightKey;
        this.dataSource[i].operatingAirline  = data.rows[i].value.operatingAirline;
        this.dataSource[i].passengercount  = data.rows[i].value.passengercount;
        this.dataSource[i].airportrunway  = data.rows[i].value.runWay;
        this.dataSource[i].updaterId        =  data.rows[i].value.updaterId;
        this.dataSource[i].status        =  this.getCodeName(data.rows[i].value.status);
        this.dataSource[i].type        =  data.rows[i].value.type;
        //this.dataSource.push(data.rows[i].value)
       }
      //console.log("result-------------", this.dataSource);
     });
    
     this.flightChainService.getCountView().subscribe((data)=>{
          
           for(let i=0;i< data.rows.length ;i++){
            
             if(data.rows[i].key[0].trim()=="SH")this.totalSheduled = data.rows[i].value;

             if(data.rows[i].key[0].trim() == "AB") {
              

              this.totalDep = data.rows[i].value;
            }
      
            if(data.rows[i].key[0].trim() == "LD") {
                    
      
              this.totalLanded = data.rows[i].value;
            }
            if(data.rows[i].key[0].trim()  == "CX") {
                    
      
              this.totalFinished = data.rows[i].value;
            }
        
      
             
           }
           });
      

    this._docSub = this.flightChainService.documents1.subscribe(document => {window.location.reload();});
    
  }

makeDataSource(flights:any[]){

 // console.log("Array length",flights.length);

  this.dataSource = new Array<TableData>(flights.length)

  for(var cnt =0 ; cnt < flights.length ; cnt++ ){
   

        this.dataSource[cnt]  = new TableData() ;

       if(flights[cnt].acrisType == "airport"){

        this.dataSource[cnt].flightKey        =  flights[cnt].flightKey;
        
        this.dataSource[cnt].operatingAirline =  flights[cnt].flightData.OperatingParties.AirlineParty.IATAIdentifier;
      if(this.dataSource[cnt].operatingAirline =="BA")
      this.dataSource[cnt].operatingAirline = "Birtish Airways";
      if(this.dataSource[cnt].operatingAirline =="AA")
      this.dataSource[cnt].operatingAirline = "American Airline";

        this.dataSource[cnt].updaterId        =  flights[cnt].updaterId;
        this.dataSource[cnt].passengercount   =  flights[cnt].flightData.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount;
        this.dataSource[cnt].airportrunway    =  flights[cnt].flightData.AirportFacility.IATAIdentifier + " " + flights[cnt].flightData.AirportFacility.RunwayFacility.RunwayIdentifier;
        let type =flights[cnt].flightData.Route.RouteInternationalDomestic;
        if(type == "I") type ="International";
        if(type == "D") type ="Domestic";
        if(type == "C") type ="Common";
        this.dataSource[cnt].type = type;
        this.dataSource[cnt].status           = this.getCodeName(flights[cnt].flightData.AircraftMovement.DisplayedAircraftMovement.AircraftMovementStatus);


     }

  }
 // console.log(this.dataSource,"Array length",this.dataSource.length);


}


makeTotalCounts(flights:any[]){

  for(var cnt =0 ; cnt < flights.length ; cnt++ ){

    if(flights[cnt].acrisType == "airport"){

      if(flights[cnt].flightData.AircraftMovement.ArrivalOrDeparture == "D") {
              
        if(flights[cnt].flightData.AircraftMovement.AircraftMovementStatus.Code == "SH") {
            
          this.totalSheduled++;
        }
        
      }

      if(flights[cnt].flightData.AircraftMovement.AircraftMovementStatus.Code == "AB") {
              

        this.totalDep++;
      }

      if(flights[cnt].flightData.AircraftMovement.AircraftMovementStatus.Code == "LD") {
              

        this.totalLanded++;
      }
      if(flights[cnt].flightData.AircraftMovement.AircraftMovementStatus.Code == "CX") {
              

        this.totalFinished++;
      }
  

    }
   
  }

}


 async getWorldStates() {

    await this.flightChainService.getWorldStates()
    .subscribe(async (flights: any[]) => {
     
  
     // this.makeDataSource(flights);
     // this.makeTotalCounts(flights);

      //this.dataSource = flights;
      let total:number =0;
      for(var cnt =0 ; cnt < flights.length ; cnt++ ){
        let iataCode = flights[cnt].flightData.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier;
        if(this.flightKeyStatusValues[iataCode] == undefined){
        this.flightKeyStatusValues[iataCode] =  [0,0,0,0,0];
        total++;
        }
        if(flights[cnt].flightData.flightStatus == "Scheduled") {

          this.totalSheduled++;
          this.flightKeyStatusValues[iataCode][0] = this.flightKeyStatusValues[iataCode][0] + 1;

        }
        if(flights[cnt].flightData.flightStatus == "Boarding") {

         
          this.flightKeyStatusValues[iataCode][1] = this.flightKeyStatusValues[iataCode][0] + 1;

        }
        if(flights[cnt].flightData.flightStatus == "Departed") {

          this.totalDep++;
          this.flightKeyStatusValues[iataCode][2] = this.flightKeyStatusValues[iataCode][1] + 1;

        }
        if(flights[cnt].flightData.flightStatus == "Landed"){

          this.totalLanded++;
          this.flightKeyStatusValues[iataCode][3] = this.flightKeyStatusValues[iataCode][2] + 1;

        } 
        if(flights[cnt].flightData.flightStatus == "FlightFinished"){

          this.flightKeyStatusValues[iataCode][4] = this.flightKeyStatusValues[iataCode][3] + 1;
          this.totalFinished++;

        }
       
       }
       this.barChartData = new Array<any>(total)
       for(var key in this.flightKeyStatusValues){
        //console.log("---key------", key);
        
        let data= new Array<number>();
        for(var i = 0;i< this.flightKeyStatusValues[key].length;i++){
          data.push(this.flightKeyStatusValues[key][i]);
          this.barChartData1[0].data[i] = this.flightKeyStatusValues[key][i];
        }
         this.barChartData1[0].data = data;
        this.barChartData.push({label:key, data:data});
      }
      //this.barChartData1 = this.barChartData;
      // console.log("---222-----",this.flightKeyTimeSeries);
       //console.log("---barchart-----",this.barChartData);

    });

     this.getFlightHistory();
  }

  getFlightCode(key):string{

     //console.log("Airline---",this.airlineName)
    return this.airlineName[key];

  
  }

 

  getFlightHistory():void{
   
    this.flightChainService.getHistoryTimeSeriesView()
    .subscribe((flightsData: any) => {
      let flights = flightsData.rows;
      let count=0;
      for(var i = flights.length-1 ; i >= 0 && count  < 50 ; i--) {
        //console.log("1111111111",flights[i].value)
         count++;
         let currentValues:any[] =  flights[i].value ;
         if(currentValues == undefined ) continue;
         this.flightKeyTimeSeries[flights[i].key[0]] = new Array<any>();
         if(currentValues.length > 1){
         currentValues.sort((a,b) => {
            let time2  =  Date.parse(b.split("|")[0]);
            let time1  =  Date.parse(a.split("|")[0]);
            return a- b;
            }); // sort descending 
          }   
         // console.log("222222222222",currentValues.length)
         for(var cnt =0 ; cnt < currentValues.length; cnt++ ){
         // console.log("3333333")
         let status = currentValues[cnt].split("|")[1];
         let time  =  currentValues[cnt].split("|")[0];
         this.flightKeyTimeSeries[flights[i].key[0]].push({"timestamp":time.toString(),"status":  this.getCodeName(status)});
         this.airlineName[flights[i].key[0]]  = flights[i].key[1]
        }
        
         
  
      }
      var cnt =0;
      for(var key in this.flightKeyTimeSeries){
       
        for(var i = 0;i< this.flightKeyTimeSeries[key].length;i++){
         
          if(this.flightKeyTimeSeries[key][i].status == undefined   )
          this.flightKeyTimeSeries[key][i].status= this.flightKeyTimeSeries[key][i-1].status
         // console.log("Data ", key, this.flightKeyTimeSeries[key][i])
        }
        cnt++;
      }
      if(cnt > 4){
      cnt = 100 * cnt;
      this.rowHeight = cnt + "px";
      }

     // console.log("Flight Key Timeseries", this.flightKeyTimeSeries);
    });
  }


 
 ConvertUTCTimeToLocalTime(UTCDateString)
    {
        var convertdLocalTime = new Date(UTCDateString);

        var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

        convertdLocalTime.setHours( convertdLocalTime.getHours() + hourOffset ); 

        return convertdLocalTime;
    }
 
    getCodeName(code:string){

      let codeArray: { [key: string]: string; } = {}; 

      codeArray["SH"] = "Scheduled";
      codeArray["RS"] = "Return to stand";
      codeArray["ES"] = "Provisional estimated operating time";
      codeArray["EX"] = "Confirmed expected operating time";
      codeArray["NI"] = "Next information";
      codeArray["CK"] = "Check in started";
      codeArray["GO"] = "Gate open";
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

}
