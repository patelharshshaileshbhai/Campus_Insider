import { Component, OnInit, signal } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ReviewService } from '../../../services/review.service';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Post } from '../../../models/post.mode';
import { PostService } from '../../../services/post.service';
import { IResponse } from '../../../models/auth/auth.model';


@Component({
  selector: 'app-feed',
  imports: [InfiniteScrollDirective,CommonModule,TitleCasePipe,DatePipe],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {

  posts: Post[] = [];    
  currentPage : number = 1;
  pageSize = 5;
  loading:boolean = false;
  hasMore:boolean = true;
  throttle = 300;
  scrollDownDistance = 1;
  scrollUpDistance = 2;
  isLiked : boolean = false;
  noOfLIkes  = signal<number>(0);

 
  constructor(private postServie: PostService) {}

  ngOnInit(): void {
    this.loadMore();
  }

  loadMore(): void{
    if(!this.hasMore) return;
    this.loading = true
    this.postServie.getPage(this.currentPage,this.pageSize).subscribe({
      next:(response) => {
       this.posts = [...this.posts, ...response.posts];
       this.hasMore = response.hasMore;
       this.currentPage++;
       this.loading = false
      },
      error: (error) => {
        console.error('Error Loading More Posts', error);
      }
    })
  }

  onScrollDown(){

      if(this.loading || !this.hasMore) return;
      this.loading = true;


      this.loadMore();

      this.loading = false;
}

handleLike(id:string){

      // Find the post in our array
      const postIndex = this.posts.findIndex(post => post.id === id);
      if (postIndex === -1) return;

  this.postServie.addLike(id).subscribe({
    next:(response)=>{
      console.log('like response',response);
      if(response.success){
        
  // Update the post's like count in our local state
  this.posts = this.posts.map(post => {
    if (post.id === id) {
      return {
        ...post,
        numbersOfLikes: post.numbersOfLikes + 1,
        isLiked: true
      };
    }
    return post;
  });

      }
      
    },
    error:(error) => {
      console.log("error occure liking post",error);
    }
  })

}

}





// ngOnInit(){
  
//   this.loadInitialReviews();
// }

// loadInitialReviews(){

//  this.loading = true;
//  this.reviewServie.getAllPostData(this.currentPage).subscribe({
//    next:(response)=>{

//      console.log(response);
//      this.feedData = response.data;
//      this.loading = false;
//    },
//    error:(error)=>{
//      console.error("Error Loading Reviews:", error);
//      this.loading = false;
//    }
//  })
// }




// onScrollDown(){

//  if(this.loading || !this.hasMore) return;

//  this.loading = true;

//  this.currentPage++;
//  this.reviewServie.getAllPostData(this.currentPage).subscribe({

//    next:(response) => {
//      console.log(response)
//      this.feedData = [...this.feedData,...response.data];
//      this.hasMore = response.hasMore;
//      this.loading = false;
//    },
//    error:(error) => {
//      console.error('Error Loading More Reviews:',error);
//      this.loading = false;
//      this.currentPage--;  //Revert page increment on error;
//    }
//  })
 
// }
// onScrollUp(){
//  console.log('scrolled Up');
//  // const start = this.feeds;
//  // this.feeds += 5;
//  // this.appendItems(start,this.feeds);
// }
