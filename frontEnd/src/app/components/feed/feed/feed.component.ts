import { Component, OnInit } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ReviewService } from '../../../services/review.service';
import { CommonModule, TitleCasePipe } from '@angular/common';


@Component({
  selector: 'app-feed',
  imports: [InfiniteScrollDirective,CommonModule,TitleCasePipe],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {

  feedData:any = [];    //create a model change this 
  currentPage : number = 1;
  loading:boolean = false;
  hasMore:boolean = true;
  throttle = 300;
  scrollDownDistance = 1;
  scrollUpDistance = 2;


 
  constructor(private reviewServie: ReviewService) {}

  ngOnInit(){
  
     this.loadInitialReviews();
  }

  loadInitialReviews(){
   
    this.loading = true;
    this.reviewServie.getReviews(this.currentPage).subscribe({
      next:(response)=>{

       this.feedData = response.reviews;
       this.hasMore = response.hasMore;
       this.loading = false;
   
      },
      error:(error)=>{
        console.error("Error Loading Reviews:", error);
        this.loading = false;
      }
    })
  }




  onScrollDown(){
 
    if(this.loading || !this.hasMore) return;

    this.loading = true;

    this.currentPage++;
    this.reviewServie.getReviews(this.currentPage).subscribe({
      next:(response) => {
        this.feedData = [...this.feedData,...response.reviews];
        this.hasMore = response.hasMore;
        this.loading = false;
      },
      error:(error) => {
        console.error('Error Loading More Reviews:',error);
        this.loading = false;
        this.currentPage--;  //Revert page increment on error;
      }
    })
    
  }
  onScrollUp(){
    console.log('scrolled Up');
    // const start = this.feeds;
    // this.feeds += 5;
    // this.appendItems(start,this.feeds);
  }
}
