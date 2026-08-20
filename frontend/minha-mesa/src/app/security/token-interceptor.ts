import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../service/auth-service/auth-service";

export function tokenInterceptor(
    req:HttpRequest<unknown>,
    next:HttpHandlerFn
) {
    const authService = inject(AuthService);
    const token = authService.getToken();
    
    if(token){
        const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(cloned);
    }

    return next(req);
}