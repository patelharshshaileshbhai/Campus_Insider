import { Component, input } from '@angular/core';
import { card } from '../../../models/interfaces/homepage.interface';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  cards : card[] = [
    {
      title:'100% Anonymous',
      discription:'Share your experiences without revealing your identity. Your privacy is our top priority.'
    },
    {
      title:'Real Student Insights',
      discription:' Get unfiltered perspectives from current students and recent graduates. '
    },
    {
      title:'Comprehensive Reviews',
      discription:'Cover everything from academics to campus life, helping you make informed decisions.'
    }
  ]
}
