import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/review.model';
import { IUser } from '../../models/auth/auth.model';
import { DialogComponent } from "../../components/common/dialog/dialog.component";

@Component({
  selector: 'app-profile-page',
  imports: [DialogComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {

  userData : IUser | null = null
  showDialog = false;
  constructor(private authService:AuthService){}

ngOnInit(): void {
  this.userData = this.authService.currentUser();
}

handleLogout(){
  this.authService.logout();
  alert('log out succefully !')
}
closeDialog(){
this.showDialog = false;
}
openDialog(){
  this.showDialog = true
}
}
