import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
show = false;

singupData : FormGroup = new FormGroup({});

constructor(){this.initialFormData();}

initialFormData (formData? : any ){              //chanage tha any type to model 
this.singupData = new FormGroup({

    userName:new FormControl(formData ? formData.userName :''),
    fullName:new FormControl(formData ? formData.fullName :''),
    email:new FormControl(formData ? formData.email : ''),
    password:new FormControl(formData ? formData.password : ''),
    gender:new FormControl(formData ? formData.gender : '')

   })
  }

  handleSignup(){
    console.log(this.singupData.value)
  }
}
