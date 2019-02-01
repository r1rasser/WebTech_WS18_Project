import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../news.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {

  constructor(private newsService: NewsService) { }

  ngOnInit() {
  }
  sendNotifications() {  
    this.newsService.send().subscribe();
  }
}
