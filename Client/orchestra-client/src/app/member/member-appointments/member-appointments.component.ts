import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../Appointment';
import { Piece } from '../../piece';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MemberDataServiceService } from '../../member-data-service.service';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-member-appointments',
  templateUrl: './member-appointments.component.html',
  styleUrls: ['./member-appointments.component.css']
})
export class MemberAppointmentsComponent implements OnInit {
  appointments: Appointment[] = []; 
  constructor(private http:HttpClient,private memberServ:MemberDataServiceService,private socket:Socket) { }

  ngOnInit() {
    this.getUserAppointments();
    this.updateAppointments();
  }
  updateAppointments():void{
    this.socket.on('appointmentUpdate',(data) => {
      console.log(data);
      this.getUserAppointments();
    });
    setTimeout(()=>this.updateAppointments(),50);
  }
  getUserAppointments(){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 
        'Authorization': window.localStorage.getItem("token").replace('"','').replace('"','')
      })
    };
    this.memberServ.userAppointments(httpOptions,JSON.parse(window.localStorage.getItem("credentials")).email)
    .subscribe((data:any) => {
      let jsonData = data.appointments;
      this.appointments = [];
      Object.keys(jsonData).forEach((key) => {
        let pieces:Piece[] = []
        Object.keys(jsonData[key].program).forEach((k)=>{
          pieces.push(new Piece(jsonData[key].program[k].title,jsonData[key].program[k].composer));
        });
        this.appointments.push(new Appointment(jsonData[key].type,jsonData[key].start,jsonData[key].end,pieces,jsonData[key].comment));
      });
    });
  }

}
