import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { apiEndPoints } from '../shared/apiEnds';
import { IloginRes, IResponse } from '../models/auth/auth.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token : string | null = null ;

  constructor(private http : HttpClient,private router: Router) { this.loadToken(); }

  login(eou:string,password:string){
    return this.http.post<IloginRes>(`${environment.BASE_URL}${apiEndPoints.LOGIN_URL}`,{eou,password}).pipe(tap(response => {
      console.log(response);
      const token = response.data.token;
      this.setToken(token);
    }))
  }


  setToken(token: string) {
    this.token = token;
    localStorage.setItem(environment.TOKEN_KEY, token);
  }

  getToken() {
    return this.token;
  }


  loadToken() {
    this.token = localStorage.getItem(environment.TOKEN_KEY) || null;
  }

  isLoggedIn():boolean{
    if(localStorage.getItem(environment.TOKEN_KEY)){
      return true
    }else return false
  }

  logout() {
    this.token = null;
    localStorage.removeItem(environment.TOKEN_KEY);
    this.router.navigate(['/signin/login']);
  }
  

  getUserData(){
    
  }


}
