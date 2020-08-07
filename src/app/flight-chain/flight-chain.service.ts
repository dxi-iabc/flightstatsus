import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AcrisFlight} from '../acris-schema/AcrisFlight';
import {catchError, mergeMap, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {FlightChainData} from "../acris-schema/AcrisFlightHistoryFromBlockchain";
import {environment} from "../../environments/environment";
import {AuthService} from '../auth/auth.service';
import {FlightHistoryResponse} from './FlightHistoryResponse';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class FlightChainService {
  documents1 = this.socket.fromEvent<string>('documents');
  constructor(private http: HttpClient,
              private _logger: NGXLogger,
              private authService: AuthService,private socket: Socket) {
  }

  private flightURL:string = environment.flightChainAPI;  // URL to web api
  private userName:string = environment.userName;
  private userPass:string = environment.userPass;
  private couchDbUrl:string = environment.couchDbUrl;
  private couchDbWithouPas:string = environment.couchWithoutAuthDbUrl;

  // private flightURL:string = 'http://fchainapi-mia.dev.blockchainsandbox.aero/flightChain/';

  /** GET one flight from the server */
  getFlight(flightKey: String): Observable<any | HttpErrorResponse> {

   /* return this.http.get<AcrisFlight>(this.flightURL + flightKey)
      .pipe(
        tap(flight => this._logger.debug('fetched flight')),
        catchError(this.handleError('getFlight', null))
      );*/

      return this.authService.login('britishairways', 'Flightchain')
      .pipe(mergeMap(authResponse => {
        console.log('I got the JWT: ' + authResponse.jwt);
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authResponse.jwt
          })
        };

        return  this.http.get<any>(this.flightURL + flightKey)
          .pipe(catchError(this.handleError('getFlight', null)));
      }));

  }


  getTableView(): Observable<any | HttpErrorResponse> {

    /* return this.http.get<AcrisFlight>(this.flightURL + flightKey)
       .pipe(
         tap(flight => this._logger.debug('fetched flight')),
         catchError(this.handleError('getFlight', null))
       );*/
 
    
 
         return  this.http.get<any>(this.couchDbUrl+"/channelflight_flightstatuschain/_design/tabledesign/_view/new-table/");
          
   }

   getCountView(): Observable<any | HttpErrorResponse> {

    /* return this.http.get<AcrisFlight>(this.flightURL + flightKey)
       .pipe(
         tap(flight => this._logger.debug('fetched flight')),
         catchError(this.handleError('getFlight', null))
       );*/
 
    
 
         return  this.http.get<any>(this.couchDbWithouPas+"/channelflight_flightstatuschain/_design/countdesign/_view/count-view?group=true");
          
   }


   getDeptCountView(): Observable<any | HttpErrorResponse> {

          return  this.http.get<any>(this.couchDbWithouPas+"/channelflight_flightstatuschain/_design/departurecountsesign/_view/departurecount-view?group=true");
          
   }
 
   
getArrvCountView(): Observable<any | HttpErrorResponse> {

    return  this.http.get<any>(this.couchDbWithouPas+"/channelflight_flightstatuschain/_design/arrivalcountdesign/_view/arrivalcount-view?group=true");
    
} 

getHistoryTimeSeriesView(): Observable<any | HttpErrorResponse> {

  return  this.http.get<any>(this.couchDbWithouPas+"/channelflight_flightstatuschain_history/_design/historialview/_view/historicaltimeline-view?group=true");
  
} 

     
  /** GET one flight from the server */
  getWorldStates(): Observable<any[] | HttpErrorResponse> {

   /* return this.http.get<FlightChainData>(this.flightURL + "flightsall")
      .pipe(
        tap(flight => this._logger.debug('fetched flight')),
        catchError(this.handleError('getFlight', null))
      );*/
      return this.authService.login('britishairways', 'Flightchain')
      .pipe(mergeMap(authResponse => {
       // console.log('I got the JWT: ' + authResponse.jwt);
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authResponse.jwt
          })
        };

        return this.http.get<any>(this.flightURL + "flightsall", httpOptions)
          .pipe(catchError(this.handleError('getWorldStates', [])));
      }));
  }
  /** GET history of updates for a flight from the server */
  getFlightHistory(flightKey: String): Observable<FlightHistoryResponse[]| HttpErrorResponse> {
    /* const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
      
        return this.http.get<FlightHistoryResponse[]>(this.flightURL + flightKey+'/history', httpOptions)
          .pipe(
            tap(flight => this._logger.debug('fetched flight history')),
            catchError(this.handleError('getFlightHistory', []))
          );*/

          return this.authService.login('britishairways', 'Flightchain')
          .pipe(mergeMap(authResponse => {
            console.log('I got the JWT: ' + authResponse.jwt);
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authResponse.jwt
              })
            };
    
            return this.http.get<FlightHistoryResponse[]>(this.flightURL + flightKey+'/history', httpOptions)
              .pipe(catchError(this.handleError('getFlightHistory', [])));
          }));
      
  }

  getDetailsByCodey(displayIdentifier: String , iataCode: String): Observable<FlightHistoryResponse[]| HttpErrorResponse> {
    /*const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer TOKEN'
      })
    };
    return this.http.get<FlightHistoryResponse[]>(this.flightURL +'/'+iataCode +"/" + iataCode, httpOptions)
          .pipe(
            tap(flight => this._logger.debug('fetched flight history')),
            catchError(this.handleError('getFlightHistory', []))
          );*/

          return this.authService.login('britishairways', 'Flightchain')
          .pipe(mergeMap(authResponse => {
            //console.log('I got the JWT: ' + authResponse.jwt);
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authResponse.jwt
              })
            };
    
            return this.http.get<FlightHistoryResponse[]>(this.flightURL +'/'+iataCode +"/" + iataCode, httpOptions)
              .pipe(catchError(this.handleError('getFlightHistory', [])));
          }));

  }

  getTransaction(transactionId: string) {
    /*const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        

        return this.http.get<any>(this.flightURL +'transaction/'+transactionId, httpOptions)
          .pipe(
            tap(flight => this._logger.debug('fetched transactionInfo')),
            catchError(this.handleError('getTransaction', null))
          );*/
     
          return this.authService.login('britishairways', 'Flightchain')
          .pipe(mergeMap(authResponse => {
            console.log('I got the JWT: ' + authResponse.jwt);
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authResponse.jwt
              })
            };
    
            return this.http.get<any>(this.flightURL +'transaction/'+transactionId, httpOptions)
              .pipe(catchError(this.handleError('getTransaction', null)));
          }));

  }

  /**
   * Handle the error, and return empty result to let app continue
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      this._logger.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this._logger.info(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(error);
    };
  }



}
