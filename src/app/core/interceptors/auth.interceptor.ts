import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private injector: Injector,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Read directly from localStorage to avoid circular dependency
        const token = localStorage.getItem('token');
        console.log('AuthInterceptor token:', token);

        // Clone request and add authorization header if token exists
        if (token) {
            console.log('Setting auth header');
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        // Handle the request and catch errors
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Unauthorized - fetch authService via injector to break circular dep
                    const authService = this.injector.get(AuthService);
                    const wasLoggedIn = authService.isLoggedIn();
                    authService.logout();

                    if (wasLoggedIn) {
                        const isAdminRoute = this.router.url.startsWith('/admin');
                        this.router.navigate([isAdminRoute ? '/admin' : '/auth/login']);
                    }
                }
                return throwError(() => error);
            })
        );
    }
}
