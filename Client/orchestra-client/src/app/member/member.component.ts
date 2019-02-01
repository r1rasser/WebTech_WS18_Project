import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login-service.service';
import { SHA512 } from 'crypto-js';
import {Socket} from 'ngx-socket-io';
import {config_local, config_network} from '../config';
import { NewsService } from '../news.service';
import { SwPush } from '@angular/service-worker';
import { VAPID_KeyPair } from '../VAPID_keys';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  showContent:boolean = false;
  showForm:boolean = true;
  showMemberData = [true,false,false,false,false,false];
  showNavigation:boolean[] = [false,false,false,false,false,false];
  email:string;
  username:string;
  password:string;
  loginForm:FormGroup;
  unread:number;
  config = config_network;
  //config = config_local;

 functions:string[] = [];
  constructor(private swPush: SwPush,private http:HttpClient, private loginService:LoginService,private socket:Socket, private newsService:NewsService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(this.email, [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl(this.password, [
        Validators.required,
        Validators.minLength(2)
      ])
    });
  }
  login(){
    // TODO: show error msg if login failed!
    if(this.isValid()){
      let url = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.memberRouteMain}/${this.config.memberRoutes.login}`;
      let body = {
        "credentials": {
          "email":this.email,
          "username":this.username,
          "password":SHA512(this.password).toString()
        }
      }
      this.loginService.login(url,body)
      .subscribe((data:any) => {
        window.localStorage.setItem("token",JSON.stringify(data.token.replace('\"','').replace('\"','').replace('"','')));
        window.localStorage.setItem("credentials",JSON.stringify({"email":data.email,"username":data.username,"password":SHA512(this.password).toString}));
        this.showForm=false;
        this.showContent=true;
        this.socket.connect();
        this.show(0);
      });
      let urlF = `http://${this.config.serverHost}:${this.config.serverPort}/${this.config.memberRouteMain}/${this.config.memberRoutes.memberFunctions}/${(this.email=='')?this.username:this.email}`;
      this.loginService.getFunctions(urlF,body).subscribe((data:any)=>{
        let functionsJSON = data.functions;
        this.functions = [];
        Object.keys(functionsJSON).forEach((key)=>{
          this.functions.push(functionsJSON[key]);
          console.log(functionsJSON[key]);
        })
        this.getBadge();
        this.updateBadge();
        this.showNavigationByFunction();
      });
      this.subscribeToNotifications();
    } else {
      // TODO!!!: Show error msg!
    }
  }
  showNavigationByFunction(){
    for(let i = 0; i < this.showNavigation.length; i++){
      this.showNavigation[i] = false;
    }
    for(let i = 0; i < this.functions.length; i++){
      if(this.functions[i] === 'MusikerIn'){
        this.showNavigation[0]=true;
      }
      if(this.functions[i] === 'IT Consultant'){
        this.showNavigation[1]=true;
      }
    }
  }
  getBadge(){
    this.newsService.numberOfUnread(this.email).subscribe((data:any)=>{
      this.unread = parseInt(data.unread);
    });
  }
  updateBadge(){
    this.socket.on('badgeUpdate',() =>{
      this.getBadge();
    })
    setTimeout(() => this.updateBadge(), 250);
  }
  logout(){
    this.showForm=true;
    this.showContent=false;
    this.loginForm.reset();
    this.show(-1);
    window.localStorage.clear();
    this.socket.disconnect();
  }
  isValid(){
    if(this.loginForm.valid){
      this.email = this.loginForm.get('email').value;
      this.username = '';
      this.password = this.loginForm.get('password').value;
      return true;
    } else if(this.loginForm.get('email').invalid && this.loginForm.get('password').valid){
      this.email = '';
      this.username = this.loginForm.get('email').value;
      this.password = this.loginForm.get('password').value;
      return true;
    }
    return false;
  }
  show(k:number){
    for(let i = 0; i < this.showMemberData.length; i++){
      this.showMemberData[i] = false;
    }
    if(k >= 0){
      this.showMemberData[k] = true;
    }
  }
  
subscribeToNotifications() {
  this.swPush.requestSubscription({
      serverPublicKey: VAPID_KeyPair.publicKey
  })
  .then(sub => {
      console.log("Notification Subscription: ", sub);
      this.newsService.addPushSubscriber(sub).subscribe(
        () => console.log('Sent push subscription object to server.'),
        err =>  console.log('Could not send subscription object to server, reason: ', err)
      )
    })
  .catch(err => console.error("Could not subscribe to notifications", err));
}
}
