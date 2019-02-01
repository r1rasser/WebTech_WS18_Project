import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../Appointment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppointmentServiceService } from '../../appointment-service.service';
import { Piece } from 'src/app/piece';
import { CreateService } from '../../create.service';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {
  
  typeSelect:string;
  from:Date;
  to:Date;
  dateTimeRange:Date[];
  appointments:Appointment[] = [];
  appointmentsScroll:Appointment[] = [];

  proramDropDown = [];
  programSelected = [];
  programDropDownSettings = {};

  availableProgram;

  typesDropDown = [];
  typesSelected = [];
  typeDropDownSettings = {};
  
  comment:string;

  constructor(private http: HttpClient, private appServ:AppointmentServiceService, private cretaeService:CreateService,private socket:Socket) { }

  ngOnInit() {
    this.getCompositions();
    this.programSelected = [];
    this.programDropDownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
    this.setTypes();
    this.typesSelected = [];
    this.typeDropDownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: '',
      unSelectAllText: '',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
  }
  setTypes(){
    this.appServ.getTypes().subscribe((data:any) => {
      let typesJSON = data.types;
      this.typesDropDown = [];
      Object.keys(typesJSON).forEach((key) => {
        let dataObj = {item_id:0,item_text:''};
        dataObj.item_id = parseInt(key);
        dataObj.item_text = typesJSON[key].name;
        this.typesDropDown.push(dataObj);
      });
    });
  }
  getCompositions(){
    this.appServ.getCompositions().subscribe((data:any) => {
      let compJSON = data.compositionData;
      this.proramDropDown = [];
      Object.keys(compJSON).forEach((key) => {
        let data = { item_id: 1, item_text: 'DUMMY' };
        data.item_id = parseInt(key);
        data.item_text = compJSON[key].composer + " - " + compJSON[key].composition;
        this.proramDropDown.push(data);
      });
      this.availableProgram = compJSON;
    });
  }
  addToList(){
    let pieces:Piece[] = [];
    for(let i = 0; i < this.programSelected.length; i++){
      pieces.push(new Piece(this.availableProgram[this.programSelected[i].item_id].composition,this.availableProgram[this.programSelected[i].item_id].composer))
    }
    this.appointments.push(new Appointment(this.typesSelected[0].item_text,this.dateTimeRange[0],this.dateTimeRange[1],pieces,this.comment));
    this.comment = "";
    this.programSelected = [];
    this.typesSelected = [];
    this.dateTimeRange = [];
    this.appointmentsScroll = [];
    for(let i = 0; i < this.appointments.length; i++){
      this.appointmentsScroll.push(this.appointments[i]);
    }
  }
  addToAppointments(){
    for(let i = 0; i < this.appointments.length; i++){
      let start:Date = this.appointments[i].start;
      let startStr = "";
      startStr += start.getFullYear() + "-";
      startStr += (start.getMonth()<9)?("0" + (start.getMonth()+1)):(start.getMonth()+1);
      startStr += "-";
      startStr += (start.getDate()<10)?("0" + (start.getDate())):(start.getDate());
      startStr += " " + start.getHours();
      startStr += ":" + start.getMinutes();
      startStr += ":00";
      let end:Date = this.appointments[i].end;
      let endStr = "";
      endStr += end.getFullYear() + "-";
      endStr += (end.getMonth()<9)?("0" + (end.getMonth()+1)):(end.getMonth()+1);
      endStr += "-";
      endStr += (end.getDate()<10)?("0" + (end.getDate())):(end.getDate());
      endStr += " " + end.getHours();
      endStr += ":" + end.getMinutes();
      endStr += ":00";
      let type = "";
      let json = {"appointments":{
        "typeID":type,
        "start":startStr,
        "end":endStr,
        "program":{},
        "comment":this.appointments[i].comment
      }};
      for(let j = 0; j < this.typesDropDown.length; j++){
        if(this.appointments[i].type === this.typesDropDown[j].item_text){
          json.appointments.typeID = this.typesDropDown[j].item_id+"";
          break;
        }
      }
      for(let j = 0; j < this.appointments[i].program.length; j++){
        for(let k = 0; k < this.proramDropDown.length; k++){
          if(this.appointments[i].program[j].composer + " - " + this.appointments[i].program[j].name === this.proramDropDown[k].item_text){
            json.appointments.program[this.proramDropDown[k].item_id] = "";
            break;
          }
        }
      }
      this.appServ.createAppointment(json);
    }
    this.socket.emit('update',"appointments");
    this.appointments = [];
    this.appointmentsScroll = [];
  }
  
  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
}
