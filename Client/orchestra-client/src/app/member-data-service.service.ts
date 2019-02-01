import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { config_local, config_network } from './config';

@Injectable({
  providedIn: 'root'
})
export class MemberDataServiceService {
  config = config_network;
  //config = config_local;
  constructor(private http: HttpClient) { }
  
  userAppointments(httpOptions,email):any{
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.appointmentsRouteMain}/${this.config.appointmentRoutes.getUserApps}/${email}`;
    return this.http.get(url, httpOptions)
    .pipe(
      catchError(this.handleError)  
    );
  }
  userData(httpOptions,email):any{
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.memberRouteMain}/${this.config.memberRoutes.userData}/${email}`;
    return this.http.get(url, httpOptions)
    .pipe(
      catchError(this.handleError)  
    );
  }
  usernameAvailability(username):any{
    let httpOptions = {
      headers: new HttpHeaders({
        'content-type':'application/json'
      })
    };
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.memberRouteMain}/${this.config.memberRoutes.usernameAvailability}/${username}`;
    return this.http.get(url,httpOptions).pipe(catchError(this.handleError));
  }
  usernameUpdate(httpOptions,body){
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.memberRouteMain}/${this.config.memberRoutes.updUsername}`;
    return this.http.patch(url,body,httpOptions).pipe(catchError(this.handleError));
  } 
  passwordUpdate(httpOptions,body){
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.memberRouteMain}/${this.config.memberRoutes.updPassword}`;
    this.http.patch(url,body,httpOptions).pipe(catchError(this.handleError)).subscribe((data:any) => {
      return data.message;
    })
  }
  userDataUpdate(httpOptions,body){
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.memberRouteMain}/${this.config.memberRoutes.updUserData}`;
    return this.http.patch(url,body,httpOptions).pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    return error.message;
  };
}