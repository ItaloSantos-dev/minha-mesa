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
            WORKING_SCHEDULES:'/restaurants/working-scheduleds'
        },
        RESERVE:{
            UPDATE:'/reserves'
        },
        TABLE:{
            DELETE:'/tables',
            CREATE:'/tables'
        }

    
    }
};