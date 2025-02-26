import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Review, ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

  reviews$: Observable<Review[]>;
  loading = false;
  
  // For detecting when user reaches the bottom of the page
  private scrollThreshold = 300;

  constructor(public reviewService: ReviewService) {
    this.reviews$ = this.reviewService.reviews$;
  }

  ngOnInit(): void {
    // Initialize the infinite scroll
    this.reviewService.initInfiniteScroll(10);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    // Check if user has scrolled to bottom
    if (this.isScrolledToBottom() && !this.loading && this.reviewService.canLoadMore()) {
      this.loadMoreReviews();
    }
  }

  isScrolledToBottom(): boolean {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    
    return documentHeight - (scrollPosition + windowHeight) < this.scrollThreshold;
  }

  loadMoreReviews(): void {
    this.loading = true;
    this.reviewService.loadMoreReviews().subscribe(success => {
      this.loading = false;
    });
  }

  likeReview(reviewId: string): void {
    this.reviewService.likeReview(reviewId).subscribe();
  }

  unlikeReview(reviewId: string): void {
    this.reviewService.unlikeReview(reviewId).subscribe();
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe();
    }
  }
}
