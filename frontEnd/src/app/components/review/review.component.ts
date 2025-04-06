import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ReviewCardComponent } from "../review-card/review-card.component";

@Component({
  selector: 'app-review',
  imports: [CommonModule, InfiniteScrollDirective, ReviewCardComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {

  
    reviews: any[] = [];    //create a model change this 
    currentPage : number = 1;
    pageSize = 5;
    loading:boolean = false;
    hasMore:boolean = true;
    throttle = 300;
    scrollDownDistance = 1;
    scrollUpDistance = 2;

    constructor(private reviewSerice : ReviewService){}

    ngOnInit(): void {
      this.loadMore();
    }

    loadMore(): void{
      if(!this.hasMore) return;

      this.reviewSerice.getPage(this.currentPage,this.pageSize).subscribe({
        next:(response) => {
          this.reviews = [...this.reviews , ...response.reviews];
          this.hasMore = response.hasMore;
          this.currentPage++;
        },
        error:(error) => {
          console.log('error loading more reviews',error);
        }
      })
    }

    onScrollDown(){
      if(this.loading || !this.hasMore) return;
      this.loading = true;
      this.loadMore();
      this.loading = false;
    }
}










  // reviews$: Observable<Review[]>;
  // loading = false;
  
  // // For detecting when user reaches the bottom of the page
  // private scrollThreshold = 300;

  // constructor(public reviewService: ReviewService) {
  //   this.reviews$ = this.reviewService.reviews$;
  // }

  // ngOnInit(): void {
  //   // Initialize the infinite scroll
  //   this.reviewService.initInfiniteScroll(10);
  // }

  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   // Check if user has scrolled to bottom
  //   if (this.isScrolledToBottom() && !this.loading && this.reviewService.canLoadMore()) {
  //     this.loadMoreReviews();
  //   }
  // }

  // isScrolledToBottom(): boolean {
  //   const windowHeight = window.innerHeight;
  //   const documentHeight = document.documentElement.scrollHeight;
  //   const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    
  //   return documentHeight - (scrollPosition + windowHeight) < this.scrollThreshold;
  // }

  // loadMoreReviews(): void {
  //   this.loading = true;
  //   this.reviewService.loadMoreReviews().subscribe(success => {
  //     this.loading = false;
  //   });
  // }

  // likeReview(reviewId: string): void {
  //   this.reviewService.likeReview(reviewId).subscribe();
  // }

  // unlikeReview(reviewId: string): void {
  //   this.reviewService.unlikeReview(reviewId).subscribe();
  // }

  // deleteReview(reviewId: string): void {
  //   if (confirm('Are you sure you want to delete this review?')) {
  //     this.reviewService.deleteReview(reviewId).subscribe();
  //   }
  // }