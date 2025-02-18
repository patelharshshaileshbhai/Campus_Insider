import { Component } from '@angular/core';
import { SvgComponent } from '../svgs/svg/svg.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [SvgComponent,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
