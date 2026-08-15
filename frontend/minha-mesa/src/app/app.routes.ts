import { Routes } from '@angular/router';
import { LandingLayout } from './componens/landing-page/layout/landing-layout/landing-layout';
import { LandingHome } from './componens/landing-page/home/landing-home/landing-home';

export const routes: Routes = [
    {
        path:'',
        component: LandingLayout,
        children:[
            {
                path:'',
                component:LandingHome
            }
        ]
    }
];
