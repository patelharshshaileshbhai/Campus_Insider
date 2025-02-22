import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

//import mock data 
const mockData = {
reviews:[
  {
    id:1,
    title:'review title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:2,
    title:'review title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:3,
    title:'review title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:4,
    title:'review title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:5,
    title:';asdf title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:6,
    title:';dkf;ldk title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:7,
    title:'jakdf;jlk title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:8,
    title:'jelkl;kd title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:9,
    title:'kdjkejn title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:11,
    title:'dlk;jfl;kad title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:13,
    title:'rele',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:14,
    title:'last rem',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  }, {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  }, {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  }, {
    id:12,
    title:'fdksl;fke',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },{
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },{
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },{
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },{
    id:10,
    title:'daskljf;d title',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id:13,
    title:'rele',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  },  {
    id:13,
    title:'rele',
    content:'this is const of the reivvew this is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvewthis is const of the reivvew',
    imageUrl:'https://images.unsplash.com/photo-1738707060236-42d641096f96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'
  }, 
],
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private pageSize = 5;



  constructor() { }

  getReviews(page:number):Observable<any>{


    //simulate api call with mockdata 

    const start = (page - 1) * this.pageSize;

    const end = start + this.pageSize;
    
    const paginatedReviews = mockData.reviews.slice(start,end);


   //simulate network call delay
    return of({reviews : paginatedReviews,hasMore : end < mockData.reviews.length}).pipe(delay(800));
  }
}
