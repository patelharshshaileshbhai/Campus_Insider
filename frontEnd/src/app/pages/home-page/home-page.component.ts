import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/common/header/header.component';
import { ArrowComponent } from "../../components/common/svgs/arrow/arrow.component";
import { CardComponent } from "../../components/common/card/card.component";


@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent, ArrowComponent, CardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {


}
