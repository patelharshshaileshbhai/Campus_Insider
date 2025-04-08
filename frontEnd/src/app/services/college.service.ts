import { computed, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { apiEndPoints } from '../shared/apiEnds';
import { IResponse } from '../models/auth/auth.model';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CollegeService {
  private colleges = signal<any>([]);
  public collegesCom = computed(() => this.colleges())
  constructor(private http : HttpClient) {}

  fetchCollege(){
 return this.http.get<IResponse>(`${environment.BASE_URL}${apiEndPoints.GET_COLLEGE}`).subscribe({
      next : (response) => {
           this.colleges.set(response.data)
      },
      error : (error) => {
        console.log("error occure while fethcing colleges")
      }
    });
  
  }


}
