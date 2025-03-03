import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, filter, map, tap } from 'rxjs';
import { IResponse } from '../models/auth/auth.model';
import { environment } from '../../environments/environment.development';
import { apiEndPontconts, authconst } from '../constants/authcons';
import { Post } from '../models/post.mode';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsSubject  = new  BehaviorSubject<IResponse | null>(null);
  private posts$ : Observable<IResponse | null> = this.postsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private fetchPosts(): void {
    if (this.postsSubject.value === null) {
      this.http.get<IResponse>(environment.BASE_URL + apiEndPontconts.POST + '/get').subscribe({
        next: (response) => {
          this.postsSubject.next(response);
        },
        error: (error) => {
          console.log("error occure in fetch posts function",error);
        }
      });
    }
  }

  getPosts(): Observable<IResponse> {
    this.fetchPosts();
    return this.posts$.pipe(
      filter(response => response !== null),
      map(response => response as IResponse)
    );
  }

  getPage(page: number, pageSize: number): Observable<{ posts: Post[], hasMore: boolean }> {
    return this.getPosts().pipe(
      map(response => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedPosts = response.data.slice(start, end);
        const hasMore = end < response.data.length;
        return { posts: paginatedPosts, hasMore };
      })
    );
  }
}

