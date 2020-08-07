import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {ILoginResponse} from './ILoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(userName: string, pass: string): Observable<ILoginResponse> {
    const url = environment.authURL + 'login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const req = {
      username: userName,
      password: pass
    };

    return this.http.post<ILoginResponse>(url, JSON.stringify(req), httpOptions)
      .pipe(catchError(this.handleError));

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred: ', error.error.message);
    } else {
      console.error('Backend returned error code: ' + error.status);
    }
    return throwError(error);
  }
}

