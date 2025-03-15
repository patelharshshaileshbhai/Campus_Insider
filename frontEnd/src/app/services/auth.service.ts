import { HttpClient } from '@angular/common/http';
import { computed, Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { apiEndPoints } from '../shared/apiEnds';
import { IloginRes, IResponse, ISignUPRes, IUser, IUserRes, singupModel } from '../models/auth/auth.model';
import { User } from '../models/review.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private token : string | null = null ;
  private currentUserSignal  = signal<IUser | null>(this.getUserFromStorage());
  public currentUser = computed(() => this.currentUserSignal())


  constructor(private http : HttpClient,private router: Router) { this.loadToken();  }

  ngOnInit(): void {
   // this.getUserData()
  }
  login(eou:string,password:string){
    return this.http.post<IloginRes>(`${environment.BASE_URL}${apiEndPoints.LOGIN_URL}`,{eou,password}).pipe(tap(response => {
      console.log(response);
      const token = response.data.token;
      this.setToken(token)
    }),
    )
  }


  signup(signupData : singupModel){
    return this.http.post<ISignUPRes>(`${environment.BASE_URL}${apiEndPoints.SIGNUP_URL}`,signupData).pipe(tap(response => {

      console.log('sign up response ',response);
      const token = response.data.token;
      this.setToken(token);

    }),
   
  );
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
    localStorage.removeItem(environment.USER_KEY);
    
    this.router.navigate(['/signin/login']);
  }
  

 getUserFromStorage():IUser | null{

  const storedUser = localStorage.getItem(environment.USER_KEY,);
  return storedUser ? JSON.parse(storedUser) : null;

  }


  fetchUserInfo() {
    console.log('fetchUserInfo called');
  
    const authToken = localStorage.getItem(environment.TOKEN_KEY); // Fetch the token from local storage
  
    const headers = {
      Authorization: `Bearer ${authToken}` // Add the token in the header manually
    };
  
    this.http.get<IUserRes>(`${environment.BASE_URL}${apiEndPoints.GET_ME}`, { headers }).pipe(
      tap(response => {
        console.log("User data from fetchUserInfo response", response.data.user);
        const userData = response.data.user;
        localStorage.setItem(environment.USER_KEY, JSON.stringify(userData));
        this.currentUserSignal.set(userData);
      })
    ).subscribe();
  }

  // fetchUserInfo(){
  //   console.log('fetchusercalled function call ')
  // this.http.get<IUserRes>(`${environment.BASE_URL}${apiEndPoints.GET_ME}`).pipe(tap(response => {   
  //     console.log("user data form fetcch user reposne ",response.data)
  //     const userData = response.data.user;
  //     localStorage.setItem(environment.USER_KEY,JSON.stringify(userData));
  //     this.currentUserSignal.set(userData);
  //   })).subscribe();
  // }

googleAuth(){
  window.location.href = 'http://localhost:8800/api/auth/google';
}


}
