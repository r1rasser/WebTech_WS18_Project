import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showPage = [true,false,false];
  title = 'orchestra-client';
  show(k:number){
    for(let i in this.showPage){
      this.showPage[i] = false;
    }
    this.showPage[k] = true;
  }
}
