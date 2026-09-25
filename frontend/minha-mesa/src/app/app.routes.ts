import { Routes } from '@angular/router';
import { LandingLayout } from './componens/landing-page/layout/landing-layout/landing-layout';
import { LandingHome } from './componens/landing-page/home/landing-home/landing-home';
import { OwnerAuth } from './componens/auth/owner/owner-auth/owner-auth';
import { UserAuth } from './componens/auth/user/user-auth/user-auth';
import { OwnerLayout } from './componens/owner/layout/owner-layout/owner-layout';
import { OwnerDashboard } from './componens/owner/restaurant/owner-dashboard/owner-dashboard';
import { OwnerShowReserve } from './componens/owner/restaurant/reserve/owner-show-reserve/owner-show-reserve';

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
    },
    {
        path:'auth/owner',
        component:OwnerAuth
    },
    {
        path:'auth/user',
        component: UserAuth
    },
    {
        path:'owner',
        component: OwnerLayout,
        children:[
            {
                path:'restaurant',
                children:[
                    {
                        path:'dashboard',
                        component:OwnerDashboard
                    },
                    {
                        path:'reservations',
                        component:OwnerShowReserve

                    }
                ]
            }
        ]
    },
];
