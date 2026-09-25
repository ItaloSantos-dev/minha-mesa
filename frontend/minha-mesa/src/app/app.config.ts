import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNgxMask } from 'ngx-mask';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './security/token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideNgxMask({dropSpecialCharacters:true}),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
