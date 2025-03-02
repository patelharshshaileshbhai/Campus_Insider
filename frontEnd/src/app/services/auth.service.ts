import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IregisterUser } from '../models/auth/auth.model';
import { environment } from '../../environments/environment.development';
import { authconst } from '../constants/authcons';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  singup(credentials:IregisterUser){

    this.http.post<unknown>(environment.API_URL + authconst.LOGIN_URL ,credentials ).subscribe((res) => {

    })

  }
}
