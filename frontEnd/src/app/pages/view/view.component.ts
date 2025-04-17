import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCompass as fasCompass } from '@fortawesome/free-solid-svg-icons';
import {  faCompass as farCompass } from '@fortawesome/free-regular-svg-icons';

import { faNewspaper as fasNewspaper } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper as farNewspaper } from '@fortawesome/free-regular-svg-icons';

import { faPenToSquare as fasPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare as farPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faSquarePlus as fasSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus as farSquarePlus } from '@fortawesome/free-regular-svg-icons';

import { faUserCircle as fasUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle as farUserCircle } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-view',
  imports: [RouterOutlet,RouterLink,RouterLink,FontAwesomeModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  constructor (public router : Router) {}
  fasCompass = fasCompass;
  farCompass = farCompass;
  fasNewspaper = fasNewspaper;
  farNewspaper = farNewspaper;
  fasPenToSquare = fasPenToSquare;
  farPenToSquare = farPenToSquare;
  fasSquarePlus = fasSquarePlus;
  farSquarePlus = farSquarePlus;
  fasUserCircle = fasUserCircle;
  farUserCircle = farUserCircle;
}
