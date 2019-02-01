import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {} from '@angular/common';
import { MemberDataServiceService } from '../../member-data-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SHA512 } from 'crypto-js';

export interface DialogData {
  name: string;
  password:string;
}
export interface PWData {
  name:string;
  oldPW: string;
  newPW:string;
}

@Component({
  selector: 'app-member-data',
  templateUrl: './member-data.component.html',
  styleUrls: ['./member-data.component.css']
})
export class MemberDataComponent implements OnInit {

  constructor(private http:HttpClient,private memberService:MemberDataServiceService,public dialog: MatDialog) { }
  saveEnabled = false;
  isAvailable:number;
  editForm:FormGroup;
  usernameUpd:string;
  emailUpd:string;
  phoneUpd:string;
  mobileUpd:string;
  confirmationPassword:string;
  userData={
    "member":{
      "membernumber":"",
      "firstname":"",
      "lastname":"",
      "dob":"",
      "username":"",
      "email":"",
      "phone":"",
      "mobile":"",
      "instrument":""
    },
    "address":{
        "street":"",
        "number":"",
        "door":"",
        "floor":"",
        "ZIP":"",
        "city":"",
        "state":""
    }
  }
  ngOnInit() {
    this.editForm = new FormGroup({
      'usernameUpd': new FormControl({value:this.usernameUpd,disabled:true}, [
        Validators.minLength(5),
      ]),
      'emailUpd': new FormControl({value:this.emailUpd,disabled:true}, [
        Validators.email
      ]),
      'phoneUpd': new FormControl({value:this.phoneUpd,disabled:true}, [
      ]),
      'mobileUpd': new FormControl({value:this.mobileUpd,disabled:true}, [
      ])
    });
    this.getMemberData();
  }
  getMemberData(){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 
        'Authorization': window.localStorage.getItem("token").replace('"','').replace('"','')
      })
    };
    this.memberService.userData(httpOptions,JSON.parse(window.localStorage.getItem("credentials")).email)
    .subscribe((data:any) => {
      this.userData = data.data;
      Object.keys(this.userData).forEach((key)=>{
        Object.keys(this.userData[key]).forEach((k) =>{
          if(this.userData[key][k] == ""){
            this.userData[key][k] = "-";
          }
        })
      });
    });
  }
  enableEdit(){
    this.editForm.get("usernameUpd").enable();
    this.editForm.get("emailUpd").enable();
    this.editForm.get("phoneUpd").enable();
    this.editForm.get("mobileUpd").enable();
    this.editForm.get("usernameUpd").setValue("");
    this.saveEnabled = true;
  }
  cancelEdit(){
    this.editForm.get("usernameUpd").disable();
    this.editForm.get("emailUpd").disable();
    this.editForm.get("phoneUpd").disable();
    this.editForm.get("mobileUpd").disable();
    this.editForm.get("usernameUpd").setValue(this.userData.member.username);
    this.editForm.get("emailUpd").setValue(this.userData.member.email);
    this.editForm.get("phoneUpd").setValue(this.userData.member.phone);
    this.editForm.get("mobileUpd").setValue(this.userData.member.mobile);
    this.saveEnabled = false;
  }
  saveEdit(){
    this.openDialog();
    this.getMemberData();
  }
  checkAvailability(){
    if(this.editForm.get("usernameUpd").valid && this.editForm.get("usernameUpd").value != "" && this.editForm.get("usernameUpd").value != this.userData.member.username){
      this.memberService.usernameAvailability(this.editForm.get("usernameUpd").value).subscribe((data:any)=>{
        if(data.availability == "0"){
          this.isAvailable = 0;
          this.usernameUpd = this.editForm.get("usernameUpd").value;
        } else {
          this.isAvailable = 1;
          this.usernameUpd = this.editForm.get("usernameUpd").value;
        }
      });
    } else if(this.editForm.get("usernameUpd").value == this.userData.member.username){
      this.isAvailable = 2;
      this.usernameUpd = this.userData.member.username;
    } else if(this.editForm.get("usernameUpd").value == ''){
      this.isAvailable = 0;
      this.usernameUpd = this.userData.member.username;
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {name: this.userData.member.firstname + ' ' + this.userData.member.lastname,password:''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === undefined){
        console.log('The operation was cancelled');
      } else {
        this.confirmationPassword = result;
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json', 
            'Authorization': window.localStorage.getItem("token").replace('"','').replace('"','')
          })
        };
        let usernameUpdBody={
          "credentials":{
            "email":this.userData.member.email,
            "password":SHA512(this.confirmationPassword).toString(),
            "newUsername":(this.editForm.get("usernameUpd").value === undefined) ? this.userData.member.username : this.editForm.get("usernameUpd").value
          }
        }
        this.memberService.usernameUpdate(httpOptions,usernameUpdBody).subscribe((data:any) => {
          console.log(data.message);
          let body={
            "credentials":{
              "email":this.userData.member.email,
              "password":SHA512(this.confirmationPassword).toString(),
              "newEmail":(this.editForm.get("emailUpd").value === undefined) ? this.userData.member.email : this.editForm.get("emailUpd").value,
              "newPhone":(this.editForm.get("phoneUpd").value === undefined) ? this.userData.member.phone : this.editForm.get("phoneUpd").value,
              "newMobile":(this.editForm.get("mobileUpd").value === undefined) ? this.userData.member.mobile : this.editForm.get("mobileUpd").value
            }
          }
          this.memberService.userDataUpdate(httpOptions,body).subscribe((data:any) => {
            console.log(data.message);
            this.memberService.userData(httpOptions,JSON.parse(window.localStorage.getItem("credentials")).email)
            .subscribe((data:any) => {
              this.userData = data.data;
              Object.keys(this.userData).forEach((key)=>{
                Object.keys(this.userData[key]).forEach((k) =>{
                  if(this.userData[key][k] == ""){
                    this.userData[key][k] = "-";
                  }
                });
                console.log('The operation was confirmed');
                this.editForm.get("usernameUpd").disable();
                this.editForm.get("emailUpd").disable();
                this.editForm.get("phoneUpd").disable();
                this.editForm.get("mobileUpd").disable();
                this.saveEnabled = false;
              });
            });
          });
        });
        
      }
    });
  }
  showChangePWDialog(){
    const dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '500px',
      data: {name: this.userData.member.firstname + ' ' + this.userData.member.lastname,oldPW:'',newPW:''}
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result !== undefined){
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json', 
            'Authorization': window.localStorage.getItem("token").replace('"','').replace('"','')
          })
        };
        let body={
          "credentials":{
            "email":this.userData.member.email,
            "oldPassword":SHA512(result.oldPW).toString(),
            "newPassword":SHA512(result.newPW).toString()
          }
        }
        this.memberService.passwordUpdate(httpOptions,body);
      }
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
})
export class ConfirmDialog {
  hide=true;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onNoClick(): void {
    this.data.password = '';
    this.dialogRef.close();
  }
}
@Component({
  selector: 'changePW-dialog',
  templateUrl: 'changePW-dialog.html',
})
export class ChangePasswordDialog {
  hide=true;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  onConfirm(): void {
    this.dialogRef.close(this.data);
  }
}