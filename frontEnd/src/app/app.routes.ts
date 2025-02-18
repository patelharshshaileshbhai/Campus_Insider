import { Routes } from '@angular/router';
import { SigninComponent } from './components/Auth/signin/signin.component';
import { LoginComponent } from './components/Auth/login/login.component';

import { SignupComponent } from './components/Auth/signup/signup.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

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
       path:'',
       component:HomePageComponent,
       
    },
    {
        path:'profile',
        component:ProfilePageComponent
    }
];
