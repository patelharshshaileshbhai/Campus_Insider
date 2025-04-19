import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { apiEndPoints } from '../shared/apiEnds';
import { IResponse } from '../models/auth/auth.model';
import { IReelResponse, Reel } from '../models/reel.model';

@Injectable({
  providedIn: 'root'
})
export class ReelService {

  private reelSignal = signal<Reel[]>(this.reelInesalizer());
  reels$ = this.reelSignal.asReadonly();
  constructor(private http : HttpClient) { }

  reelInesalizer(){
    return [{
       id: '',
        caption:  '',
        videoUrl:  '',
        publicId:   '',
        createdAt:   '',
        user: {
          id:  '',
          fullname:  '',
          username:  '',
          profileUrl:  '',
        }
    }]
  }

  getReels(page: number = 1, limit: number = 2): void {
    const url = `${environment.BASE_URL}${apiEndPoints.GET_REELS}?page=${page}&limit=${limit}`;
    
    this.http.get<IReelResponse>(url).subscribe({
      next: (response) => {
        if(response.success){
          const existing = this.reelSignal();
          console.log(response.data)
          this.reelSignal.set([...existing, ...response.data.reels]);
          console.log(this.reels$());
        }
      },
      error: (error) => {
        console.error('Error fetching reels:', error);
      }
    });
  }
}
