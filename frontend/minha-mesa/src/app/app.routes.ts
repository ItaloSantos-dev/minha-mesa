import { Routes } from '@angular/router';
import { LandingLayout } from './componens/landing-page/layout/landing-layout/landing-layout';
import { LandingHome } from './componens/landing-page/home/landing-home/landing-home';
import { OwnerAuth } from './componens/auth/owner/owner-auth/owner-auth';
import { UserAuth } from './componens/auth/user/user-auth/user-auth';
import { OwnerLayout } from './componens/owner/layout/owner-layout/owner-layout';
import { OwnerDashboard } from './componens/owner/restaurant/owner-dashboard/owner-dashboard';
import { OwnerShowReserve } from './componens/owner/restaurant/reserve/owner-show-reserves/owner-show-reserves';
import { OwnerShowReserve as OwnerReserveDetails } from './componens/owner/restaurant/reserve/owner-show-reserve/owner-show-reserve';
import { OwnerShowTables } from './componens/owner/restaurant/table/owner-show-tables/owner-show-tables';
import { OwnerShowWorkingSchedules } from './componens/owner/restaurant/working-schedule/owner-show-working-schedules/owner-show-working-schedules';
import { OwnerShowSchedulesException } from './componens/owner/restaurant/schedule-exception/owner-show-schedules-exception/owner-show-schedules-exception';

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
                        path:'reservations/:id',
                        component:OwnerReserveDetails
                    },
                    {
                        path:'dashboard',
                        component:OwnerDashboard
                    },
                    {
                        path:'tables',
                        component:OwnerShowTables
                    },
                    {
                        path:'working-schedules',
                        component:OwnerShowWorkingSchedules
                    },
                    {
                        path:'schedule-exceptions',
                        component:OwnerShowSchedulesException
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
