import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { config_local, config_network } from './config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  config = config_network;
  //config = config_local;

  constructor(private http: HttpClient) { }
  login(loginUrl:any, body){
    return this.http.post(loginUrl, body, httpOptions)
    .pipe(
      catchError(this.handleError)  
    );
  }
  getFunctions(url:any,body){
    return this.http.get(url, httpOptions)
    .pipe(
      catchError(this.handleError)  
    );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };
}
