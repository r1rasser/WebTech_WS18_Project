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
export class AppointmentServiceService {
  config = config_network;
  //config = config_local;
  constructor(private http: HttpClient) {}

  getCompositions(){
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.appointmentsRouteMain}/${this.config.appointmentRoutes.getComp}`;
    return this.http.get(url,httpOptions).pipe(catchError(this.handleError));
  }
  getTypes(){
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.appointmentsRouteMain}/${this.config.appointmentRoutes.getTypes}`;
    return this.http.get(url,httpOptions).pipe(catchError(this.handleError));
  }
  createAppointment(body:any){
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.appointmentsRouteMain}/${this.config.appointmentRoutes.createAppointment}`;
    this.http.post(url,body,httpOptions)
    .pipe(
      catchError(this.handleError)
    ).subscribe((data:any)=>{
      console.log(data.message);
    });
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
