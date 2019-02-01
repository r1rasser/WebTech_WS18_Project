import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']/*,
  encapsulation: ViewEncapsulation.None*/
})
export class SiteComponent implements OnInit {

  loginForm:FormGroup;
  email:string;
  password:string;
  constructor() { }

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
    console.log("Logging in...");
  }

}
