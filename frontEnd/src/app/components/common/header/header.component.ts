import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {

   logedIN :boolean = false;

  constructor(private authService : AuthService){
   this.logedIN = this.authService.isLoggedIn();
  }

 




}
