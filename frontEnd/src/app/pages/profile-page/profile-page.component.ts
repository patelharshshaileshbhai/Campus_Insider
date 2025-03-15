import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/review.model';
import { IUser } from '../../models/auth/auth.model';

@Component({
  selector: 'app-profile-page',
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {

  userData : IUser | null = null
  constructor(private authService:AuthService){}

ngOnInit(): void {
  this.authService.fetchUserInfo();
  console.log(this.authService.currentUser())
  console.log('fetch user completed ')
  this.userData = this.authService.currentUser();
}
}
