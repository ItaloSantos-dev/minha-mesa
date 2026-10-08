export const API_BACK_CONFIG = {
  URL: 'http://localhost:8080',

    ENDPOINTS: {
        AUTH:{
            REGISTER:'/auth/register',
            LOGIN: '/auth/login'
        },
        RESTAURANT: {
            CREATE : '/restaurants',
            DASHBOARD : '/restaurants/dashboard',
            RESERVES : '/restaurants/reserves',
            TABLES : '/restaurants/tables',
            WORKING_SCHEDULES:'/restaurants/working-scheduleds',
            SCHEDULE_EXCEPTIONS:'/restaurants/schedule-exceptions'
        },
        RESERVE:{
            UPDATE:'/reserves'
        },
        TABLE:{
            DELETE:'/tables',
            CREATE:'/tables'
        },
        WORKING_SCHEDULEDS:{
            CREATE:'/working-schedules'
        },
        

    
    }
};