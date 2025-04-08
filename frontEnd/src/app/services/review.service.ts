import { HttpClient, HttpParams  } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { BehaviorSubject, delay, filter, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IResponse } from '../models/auth/auth.model';
import { Post } from '../models/post.mode';
import { apiEndPoints } from '../shared/apiEnds';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private reviewsSubject = new BehaviorSubject< IResponse | null>(null);
  private reviews$ : Observable< IResponse | null> = this.reviewsSubject.asObservable();
  
  constructor(private http : HttpClient){}

  private fetchReviews():void{
   if(this.reviewsSubject.value == null) {
    this.http.get<IResponse>(`${environment.BASE_URL}${apiEndPoints.GET_REVIEW}`).subscribe({
      next : (response) => {
        this.reviewsSubject.next(response);
      },
      error:(error) => {
        console.log('errorr occure in fetch review functions ',error);
      }
    })
   }
  }

  createReview(formData:any){
    return this.http.post(`${environment.BASE_URL}${apiEndPoints.CREATE_REVIEW}`,formData)
  }

  getReviews() : Observable<IResponse>{
    this.fetchReviews();
    return this.reviews$.pipe(
      filter(response => response !== null),
      map(response => response as IResponse)
    )
  }
   
  getPage (page : number, pageSize : number): Observable<{reviews : any[], hasMore:boolean}>{
    return this.getReviews().pipe(
      map(response => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedPosts = response.data.slice(start, end);
        const hasMore = end < response.data.length;
        return { reviews: paginatedPosts, hasMore };
      })
    )
  }
}
