// review-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Review {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  title: string;
  content: string;
  votes: number;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  content: string;
  votes: number;
}

@Component({
  selector: 'app-review-card',
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})


export class ReviewCardComponent implements OnInit {
  @Input() reviews!: any;
  
  newReply: string = '';
  showReplies: boolean = false;
  modalOpen: boolean = false;
  
  ngOnInit(): void {
    console.log('review from the review card ',this.reviews)
  
  }
  toggleReplies(): void {
    this.showReplies = !this.showReplies;
  }
  
  submitReply(): void {
    if (!this.newReply.trim()) return;
    
    // In a real app, you would call a service to save the reply
    const newReplyObj: Reply = {
      id: Date.now().toString(),
      author: {
        name: 'Current User', // This would come from your auth service
        avatar: '/placeholder.svg?height=40&width=40'
      },
      createdAt: new Date(),
      content: this.newReply,
      votes: 0
    };
    
    this.reviews.replies.push(newReplyObj);
    this.newReply = '';
    this.showReplies = true;
  }
  
  upvote(): void {
    this.reviews.votes++;
  }
  
  downvote(): void {
    this.reviews.votes--;
  }
  
  upvoteReply(reply: Reply): void {
    reply.votes++;
  }
  
  downvoteReply(reply: Reply): void {
    reply.votes--;
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  }
  
  isLongContent(content: string): boolean {
    return content.length > 10; // Rough estimate for 4 lines 240
  }
  
  openModal(): void {
    this.modalOpen = true;
  }
  
  closeModal(): void {
    this.modalOpen = false;
  }
}
