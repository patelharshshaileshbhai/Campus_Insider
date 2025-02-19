import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
show = false;
loginData : FormGroup = new FormGroup({});
constructor(){this.loginDataInitialization();}
loginDataInitialization(formData?:any){                    //change the type here 
  this.loginData = new FormGroup({
    email:new FormControl(formData ? formData.email : ''),
    password:new FormControl(formData ? formData.password : ''),
   })
}

handleLogIn(){
  const formData = this.loginData.value;
  console.log('login clicked')
  console.log(formData)
}
}
