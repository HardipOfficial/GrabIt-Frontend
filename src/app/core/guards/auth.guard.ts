import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isAdminRoute = state.url.startsWith('/admin');
        const isLoggedIn = this.authService.isLoggedIn();
        const isAdmin = this.authService.isAdmin();

        // For admin routes
        if (isAdminRoute) {
            if (isLoggedIn && isAdmin) {
                // User is logged in and is admin, allow access to admin routes
                return true;
            } else {
                // Not logged in or not admin, redirect to admin login
                this.router.navigate(['/admin'], {
                    queryParams: { returnUrl: state.url }
                });
                return false;
            }
        }

        // For non-admin routes, allow access (ClientGuard will handle admin restrictions)
        return true;
    }
}
