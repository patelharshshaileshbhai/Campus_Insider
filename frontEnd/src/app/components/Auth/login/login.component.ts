import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
show = false;
loginForm : FormGroup = new FormGroup({});
errorMessaage:string | null = null;


constructor(private fb : FormBuilder,
            private authService : AuthService,
            private router : Router)

{ 
  this.createForm();
}

createForm(){
  this.loginForm = this.fb.group({
    eou:['',[Validators.required]],
    password:['',[Validators.required]]
  })
}

usernameValidator() {
  return (control: any): { [key: string]: boolean } | null => {
    if (control.value.length < 3) return { invalidUsername: true };
    return null;
  };
}

passwordValidator() {
  return (control: any): { [key: string]: boolean } | null => {
    if (control.value.length < 6) return { invalidPassword: true };
    return null;
  };
}


handleLogIn(){
if(this.loginForm.valid){
  const eou = this.loginForm.get('eou')?.value;
  const password = this.loginForm.get('password')?.value;

  console.log('login in infor =>' +{eou:eou,password:password});

  this.authService.login(eou,password).pipe(
    tap(() => {
      this.router.navigate(['/feed-page']);
    }),
    catchError(error => {
      this.errorMessaage = error.message;
      return throwError(() => error);
    }),

  )
  .subscribe();

}
}
}
