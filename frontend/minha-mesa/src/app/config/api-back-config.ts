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
            RESERVES : '/restaurants/reserves'
        },
        RESERVE:{
            UPDATE:'/reserves'
        }

    
    }
};