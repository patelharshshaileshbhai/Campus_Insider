import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment.development';

 @Injectable()

 export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,private router : Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhNzllNDFlLTg5MTYtNGMwNS05YTA3LTcxZDM5YTg3Mzk3MiIsImlhdCI6MTc0MjAzODc2MCwiZXhwIjoxNzQyMTI1MTYwfQ.RH3gKk4RyT5TSosDX--nGJ5jdfCoQbMc2X2dugwGoyQ'
    
    console.log('auth token ',authToken)

    if (authToken) {
      // Clone the request and attach the token
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next.handle(authReq);
    }

    return next.handle(req).pipe(catchError(error => {
      if (error.status === 401) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
      return throwError(() => error);
    }));
  }


  
}