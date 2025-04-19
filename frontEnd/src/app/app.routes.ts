import { Routes } from '@angular/router';
import { SigninComponent } from './components/Auth/signin/signin.component';
import { LoginComponent } from './components/Auth/login/login.component';

import { SignupComponent } from './components/Auth/signup/signup.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { FeedComponent } from './components/feed/feed/feed.component';
import { FeedpageComponent } from './pages/feedpage/feedpage.component';
import { ReviewComponent } from './components/review/review.component';
import { CreatePostComponent } from './components/Post/create-post/create-post.component';
import { AuthGuard } from './Guards/auth.guard';
import { ViewComponent } from './pages/view/view.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { CreateReviewComponent } from './components/create-review/create-review.component';
import { ReelComponent } from './components/reel/reel.component';

export const routes: Routes = [
    {
        path:'signin',
        redirectTo:'signin/login',
        pathMatch:'full',
    },
    {
        path:'signin',
        component:SigninComponent,
        children:[
            {
                path:'login',
                component:LoginComponent
            },
            {
                path:'signup',
                component:SignupComponent
            }
        ]
    },
    {
        path:'home',
        component:HomePageComponent,

    },
    {
        path:'googleauth',
        component:GoogleAuthComponent
    },
    
    {
        path:'newReview',
        component:ReviewCardComponent
    },
    {
        path:'',
        redirectTo:'feed-page',
        pathMatch:'full'
    },
    {
       path:'',
       component:ViewComponent,
       children:[
        {
            path:'profile',
            component:ProfilePageComponent,
            canActivate:[AuthGuard]
        },
        {
            path:'feed-page',
            component:FeedpageComponent,
            canActivate:[AuthGuard]
          },
          {
              path:'review',
              component:ReviewComponent,
              canActivate:[AuthGuard]
          },
          {
              path:'create-post',
              component:CreatePostComponent,
              canActivate:[AuthGuard]
          },
          {
            path:'create-review',
            component:CreateReviewComponent,
            canActivate:[AuthGuard]
          }
      ]
    },

    {
        path:'reel',
        component:ReelComponent
    }
   
    
];
