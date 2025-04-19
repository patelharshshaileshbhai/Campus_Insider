import { Component, effect, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Reel } from '../../models/reel.model';
import { ReelService } from '../../services/reel.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-reel',
  standalone:true,
  imports: [DatePipe, 
    CommonModule,
  ],
  templateUrl: './reel.component.html',
  styleUrl: './reel.component.scss',
})
export class ReelComponent {
  reels!: Reel[];
  currentReelIndex = 0;
  startY: number = 0;
  deltaY: number = 0;
  direction: 'up' | 'down' | null = null;
  reelLiked = false;
  page = 1;
  limit=2;
  isLoading = false;

  constructor(private reelService: ReelService) {
    // Reactively update component state from signal
    effect(() => {
      this.reels = this.reelService.reels$() ?? [];
      console.log(this.reels);
    });
  }

  ngOnInit(): void {
    this.reelService.getReels(); // Fetch reels
  }




onScroll(event: Event): void {
  const container = event.target as HTMLElement;
  const scrollPosition = container.scrollTop + container.clientHeight;
  const scrollHeight = container.scrollHeight;

  const nearBottom = scrollHeight - scrollPosition < 100;

  if (nearBottom && !this.isLoading) {
     this.loadMoreReels();
  }
}

loadMoreReels(){
  this.isLoading = true;
  this.page ++;

  this.reelService.getReels(this.page,this.limit);

  setTimeout(() => {
    this.isLoading = false;
  })


}
  toggleLike() {
   this.reelLiked = true;
  }
  onTouchStart(event: TouchEvent): void {
    this.startY = event.touches[0].clientY;
  }
  
  onTouchEnd(event: TouchEvent): void {
    this.deltaY = event.changedTouches[0].clientY - this.startY;
    const direction = this.deltaY < -30 ? 'up' : this.deltaY > 30 ? 'down' : null;
  
    if (direction) {
      this.onSwipe(event, direction);
    }
  }
  
  onSwipe(event: TouchEvent, direction: 'up' | 'down') {
    if (direction === 'up' && this.currentReelIndex < this.reels.length - 1) {
      this.currentReelIndex++;
    } else if (direction === 'down' && this.currentReelIndex > 0) {
      this.currentReelIndex--;
    }

    const container = document.getElementById('reel-scroll-container');
    if (container) {
      container.scrollTo({
        top: window.innerHeight * this.currentReelIndex,
        behavior: 'smooth',
      });
    }
  }
}
