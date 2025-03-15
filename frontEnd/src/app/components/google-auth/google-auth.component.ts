import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-auth',
  imports: [],
  templateUrl: './google-auth.component.html',
  styleUrl: './google-auth.component.scss'
})
export class GoogleAuthComponent  implements OnInit{

  constructor(private authService : AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log("user data ", token)
    if (token) {
      localStorage.setItem(environment.TOKEN_KEY, token); // Store the token
      this.authService.fetchUserInfo();
      this.router.navigate(['/feed-page']); // Redirect to feed page
    } else {
      this.router.navigate(['/login']); // Handle failure
    }
  }
}
