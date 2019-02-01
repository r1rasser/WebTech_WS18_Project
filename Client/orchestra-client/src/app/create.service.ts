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
export class CreateService {
  config = config_network;
  //config = config_local;

  constructor(private http: HttpClient) { }
  
  createAppointment(body:any){
    let url = `http://${this.config.serverHost}/${this.config.serverPort}/${this.config.appointmentsRouteMain}/${this.config.appointmentRoutes.createAppointment}`;
    return this.http.post(url,body,httpOptions)
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
        `body was: ${error.message}`);
    }
    return error.message;
  };
}
