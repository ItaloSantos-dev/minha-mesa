import { HttpInterceptorFn } from "@angular/common/http";

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const xsrfToken = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  return next(req.clone({
    withCredentials: true,
    setHeaders: xsrfToken
      ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }
      : {}
  }));
};