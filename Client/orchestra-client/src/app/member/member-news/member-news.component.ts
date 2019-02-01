import { Component, OnInit } from '@angular/core';
import { NewsService, News } from '../../news.service';

@Component({
  selector: 'app-member-news',
  templateUrl: './member-news.component.html',
  styleUrls: ['./member-news.component.css']
})
export class MemberNewsComponent implements OnInit {

  constructor(private newsService:NewsService) { }
  news: News[] = [];
  newsScroll: News[] = [];
  ngOnInit() {
    this.getNews();
  }
  getNews(){
    this.newsService.getMemberNews(JSON.parse(window.localStorage.getItem("credentials")).email).subscribe((data:any)=>{
      let newsJson = data.news;
      this.news = [];
      this.newsScroll = [];
      Object.keys(newsJson).forEach((key)=>{
        this.news.push(new News(key, newsJson[key].type,newsJson[key].text,newsJson[key].comp,newsJson[key].link,newsJson[key].read));
      })
      for(let i = 0; i < this.news.length; i++){
        this.newsScroll[i] = this.news[i];
      }
    });
  }
  show(id){
    this.newsService.markAsRead(id);
    this.getNews();
  }
}
