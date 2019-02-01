import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { config_local, config_network } from './config';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  config = config_network;
  //config = config_local;

  constructor(private http: HttpClient,private socket:Socket) { }

  getMemberNews(email:string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 
        'Authorization': window.localStorage.getItem("token").replace('"','').replace('"','')
      })
    };
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.newsRouteMain}/${this.config.newsRoutes.getMemberNews}/${email}`;
    return this.http.get(url,httpOptions).pipe(catchError(this.handleError));
  }

  numberOfUnread(email:string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 
        'Authorization': window.localStorage.getItem("token").replace('"','').replace('"','')
      })
    };
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.newsRouteMain}/${this.config.newsRoutes.getUnread}/${email}`;
    return this.http.get(url,httpOptions).pipe(catchError(this.handleError));
  }

  markAsRead(id:string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 
        'Authorization': window.localStorage.getItem("token").replace('"','').replace('"','')
      })
    };
    let body = {
      "id":id,
      "email":JSON.parse(window.localStorage.getItem("credentials")).email
    }
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.newsRouteMain}/${this.config.newsRoutes.markAsRead}`;
    return this.http.patch(url,body,httpOptions).pipe(catchError(this.handleError)).subscribe((data:any)=>{
      this.socket.emit('markedAsRead');
    });
  }
  
  addPushSubscriber(sub:any) {
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.notificationsMain}/${this.config.notificationsRoutes.subscribe}`;
    return this.http.post(url, sub);
  }
  send() {
    let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.notificationsMain}/${this.config.notificationsRoutes.sendAll}`;
    return this.http.post(url, null);
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

export class News{
  constructor(public id:string, public type:string, public text:string, public comp:string,public link:string, public read:boolean){}
}