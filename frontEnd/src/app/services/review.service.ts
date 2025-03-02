import { HttpClient, HttpParams  } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
//import mock data 
const mockData = {
reviews:[
  {
    id:1,
    title:'review title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:2,
    title:'review title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:3,
    title:'review title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:4,
    title:'review title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:5,
    title:';asdf title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:6,
    title:';dkf;ldk title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:7,
    title:'jakdf;jlk title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:8,
    title:'jelkl;kd title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:9,
    title:'kdjkejn title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:11,
    title:'dlk;jfl;kad title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:13,
    title:'rele',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:14,
    title:'last rem',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  }, {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  }, {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  }, {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },{
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },{
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },{
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },{
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id:13,
    title:'rele',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:13,
    title:'rele',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  }, 
],
}

//inteface for the data
export interface Review {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  media?: string;
  isDeleted: boolean;
  numbersOfLikes: number;
  comments?: Comment[];
  user?: User;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  reviewId: string;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface AddReviewRequest {
  title: string;
  content: string;
  media?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private pageSize = 5;

  // For infinite scroll
  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  reviews$ = this.reviewsSubject.asObservable();
  private apiUrl = environment.Data_URL;

  private currentPage = 1;
  private limit = 10;
  private loading = false;
  private hasMoreReviews = true;

  constructor(private  http : HttpClient) { }

    /**
   * Initialize or reset the infinite scroll
   */
    initInfiniteScroll(limit: number = 10): void {
      this.reviewsSubject.next([]);
      this.currentPage = 1;
      this.limit = limit;
      this.loading = false;
      this.hasMoreReviews = true;
      this.loadMoreReviews();
    }

      /**
   * Load more reviews for infinite scroll
   * @returns Observable indicating if operation was successful
   */
  loadMoreReviews(): Observable<boolean> {
    if (this.loading || !this.hasMoreReviews) {
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }
    this.loading = true;
    
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('limit', this.limit.toString());
    
    return this.http.get<PaginatedResponse<Review>>(`${environment.Data_URL}`, { params }).pipe(
      tap(response => {
        const currentReviews = this.reviewsSubject.getValue();
        this.reviewsSubject.next([...currentReviews, ...response.data]);
        
        this.currentPage++;
        this.hasMoreReviews = response.hasMore;
        this.loading = false;
      }),
      map(() => true)
    );
  }

   /**
   * Check if more reviews can be loaded
   */
   canLoadMore(): boolean {
    return this.hasMoreReviews && !this.loading;
  }
  /*
  * Get all reviews with optional pagination (standard method)
  * @param page Page number (starts at 1)
  * @param limit Number of reviews per page
  * @returns Observable with array of reviews
  */
 getAllReviews(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Review>> {
   const params = new HttpParams()
     .set('page', page.toString())
     .set('limit', limit.toString());
   
   return this.http.get<PaginatedResponse<Review>>(environment.Data_URL + '/get', { params });
 }


 /**
   * Get a specific review by ID including its comments
   * @param id Review ID
   * @returns Observable with review details including comments
   */
 getReviewById(id: string): Observable<Review> {
  return this.http.get<Review>(`${this.apiUrl}/${id}?includeComments=true`);
}

/**
 * Get all comments for a specific review
 * @param reviewId Review ID
 * @returns Observable with array of comments
 */
getReviewComments(reviewId: string): Observable<Comment[]> {
  return this.http.get<Comment[]>(`${this.apiUrl}/${reviewId}/comments`);
}

/**
 * Add a new review
 * @param review Review data to be added
 * @returns Observable with the created review
 */
addReview(review: AddReviewRequest): Observable<Review> {
  return this.http.post<Review>(this.apiUrl, review).pipe(
    tap(newReview => {
      // Update the reviews list with the new review
      const currentReviews = this.reviewsSubject.getValue();
      this.reviewsSubject.next([newReview, ...currentReviews]);
    })
  );
}

/**
 * Add a comment to a review
 * @param reviewId Review ID
 * @param content Comment content
 * @returns Observable with the created comment
 */
addComment(reviewId: string, content: string): Observable<Comment> {
  return this.http.post<Comment>(`${this.apiUrl}/${reviewId}/comments`, { content });
}

/**
 * Like a review
 * @param reviewId Review ID
 * @returns Observable with updated like count
 */
likeReview(reviewId: string): Observable<{ numbersOfLikes: number }> {
  return this.http.post<{ numbersOfLikes: number }>(`${this.apiUrl}/${reviewId}/like`, {}).pipe(
    tap(result => {
      this.updateReviewLikes(reviewId, result.numbersOfLikes);
    })
  );
}

/**
 * Unlike a review
 * @param reviewId Review ID
 * @returns Observable with updated like count
 */
unlikeReview(reviewId: string): Observable<{ numbersOfLikes: number }> {
  return this.http.delete<{ numbersOfLikes: number }>(`${this.apiUrl}/${reviewId}/like`).pipe(
    tap(result => {
      this.updateReviewLikes(reviewId, result.numbersOfLikes);
    })
  );
}

/**
 * Delete a review
 * @param reviewId Review ID
 * @returns Observable with success message
 */
deleteReview(reviewId: string): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.apiUrl}/${reviewId}`).pipe(
    tap(() => {
      // Remove the review from the current list
      const currentReviews = this.reviewsSubject.getValue();
      this.reviewsSubject.next(currentReviews.filter(review => review.id !== reviewId));
    })
  );
}

/**
 * Update a review
 * @param reviewId Review ID
 * @param updateData Updated review data
 * @returns Observable with updated review
 */
updateReview(reviewId: string, updateData: Partial<AddReviewRequest>): Observable<Review> {
  return this.http.patch<Review>(`${this.apiUrl}/${reviewId}`, updateData).pipe(
    tap(updatedReview => {
      // Update the review in the current list
      const currentReviews = this.reviewsSubject.getValue();
      const updatedReviews = currentReviews.map(review => 
        review.id === reviewId ? {...review, ...updatedReview} : review
      );
      this.reviewsSubject.next(updatedReviews);
    })
  );
}

/**
 * Update the like count for a review in the local state
 */
private updateReviewLikes(reviewId: string, likeCount: number): void {
  const currentReviews = this.reviewsSubject.getValue();
  const updatedReviews = currentReviews.map(review => 
    review.id === reviewId ? {...review, numbersOfLikes: likeCount} : review
  );
  this.reviewsSubject.next(updatedReviews);
}

  getReviews(page:number):Observable<any>{

  

    this.http.get(environment.Data_URL + 'get').subscribe((res) => {

      
    });
    //simulate api call with mockdata 

    const start = (page - 1) * this.pageSize;

    const end = start + this.pageSize;
    
    const paginatedReviews = mockData.reviews.slice(start,end);


   //simulate network call delay
    return of({reviews : paginatedReviews,hasMore : end < mockData.reviews.length}).pipe(delay(800));
  }
}
