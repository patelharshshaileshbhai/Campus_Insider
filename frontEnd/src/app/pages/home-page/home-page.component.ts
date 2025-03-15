import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/common/header/header.component';
import { CardComponent } from "../../components/common/card/card.component";
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent,RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {


}
