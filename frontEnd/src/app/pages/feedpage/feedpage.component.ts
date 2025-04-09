import { Component, OnInit } from '@angular/core';
import { FeedComponent } from "../../components/feed/feed/feed.component";
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/auth/auth.model';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-feedpage',
  imports: [FeedComponent,RouterLink],
  templateUrl: './feedpage.component.html',
  styleUrl: './feedpage.component.scss'
})
export class FeedpageComponent implements OnInit{

  userData : IUser | null = null;
  constructor(private authService:AuthService){}

  ngOnInit(): void {
    
    this.userData = this.authService.currentUser();
    console.log('user DAta from feed page ',this.userData)
  }


}
