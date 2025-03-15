import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view',
  imports: [RouterOutlet,FontAwesomeModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  faHouse = faHouse;
}
