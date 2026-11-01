export const API_BACK_CONFIG = {
  URL: 'http://localhost:8080',

    ENDPOINTS: {
        AUTH:{
            REGISTER:'/auth/register',
            LOGIN: '/auth/login'
        },
        USER:{
            DASHBOARD:'/users/dashboard',
            RESERVES:'/users/reserves'
        },
        RESTAURANT: {
            CREATE : '/restaurants',
            FIND: (id:number) : string =>{
                return `/restaurants/${id}`
            },
            DASHBOARD : '/restaurants/dashboard',
            RESERVES : '/restaurants/reserves',
            TABLES : '/restaurants/tables',
            WORKING_SCHEDULES:'/restaurants/working-scheduleds',
            SCHEDULE_EXCEPTIONS:'/restaurants/schedule-exceptions',
            SEARCH:(search:string, page:number):string =>{
                return `/restaurants?search=${search}&page=${page}`
            }
        },
        RESERVE:{
            CREATE:'/reserves',
            UPDATE:'/reserves'
        },
        TABLE:{
            AVAILABLE:'/tables',
            UPDATE_STATUS: (id:number):string=>{
                return `/tables/${id}/update-status`
            },
            CREATE:'/tables'
        },
        WORKING_SCHEDULEDS:{
            CREATE:'/working-schedules'
        },
        SCHEDULE_EXCEPTION:{
            CREATE:'/schedule-exceptions',
            UPDATE_STATUS: (id:number):string=>{
                return `/schedule-exceptions/${id}/update-status`
            }
        }
        

    
    },

    
};