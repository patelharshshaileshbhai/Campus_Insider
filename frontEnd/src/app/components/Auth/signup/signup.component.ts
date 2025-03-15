import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { flush } from '@angular/core/testing';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
show = false;
signUpForm : FormGroup = new FormGroup({});
errorMessage : string | null = null

constructor(private fb:FormBuilder,
            private authService : AuthService,
            private router:Router,
            private route: ActivatedRoute){this.initialFormData();}

initialFormData (){              //chanage tha any type to model 
this.signUpForm = this.fb.group({
  username:['',Validators.required],
  fullname:['',Validators.required],
  password:['',Validators.required],
  gender:['',Validators.required],
  email:['',Validators.required],
})
  }


  ngOnInit() {
    const userData = this.route.snapshot.queryParamMap.get('userData');
    if (userData) {
      console.log("userData ",userData)
      // localStorage.setItem('auth_token', token); // Store the token
      this.router.navigate(['/feed-page']); // Redirect to feed page
    } else {
      this.router.navigate(['/login']); // Handle failure
    }
  }

  handleSignup(){
    if(this.signUpForm.valid){
      const signupData = this.signUpForm.value;
      this.authService.signup(signupData).pipe(
        tap(() => {
          this.router.navigate(['/feed-page']);
        }),
        catchError(error => {
          this.errorMessage = error.message
          return throwError(() => error);
        })
      ).subscribe();
    }
   
  }


  hanglegoogle() {
  this.authService.googleAuth();
}
    
  
}
