import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/review.model';
import { IUser } from '../../../models/auth/auth.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

   logedIN :boolean = false;
   userData : IUser | null = null;


  constructor(private authService : AuthService){
   this.logedIN = this.authService.isLoggedIn();
  }


  ngOnInit(): void {
    this.userData = this.authService.currentUser();
 
  }

  

 




}
