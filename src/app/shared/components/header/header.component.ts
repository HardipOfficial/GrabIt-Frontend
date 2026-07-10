import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    cartItemCount$!: Observable<number>;
    isLoggedIn = false;
    isAdmin = false;
    mobileMenuOpen = false;
    clientName = '';

    constructor(
        private authService: AuthService,
        private cartService: CartService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cartItemCount$ = this.cartService.getCartItemCount$();

        this.authService.currentUser$.subscribe(user => {
            this.isLoggedIn = !!user;
            this.isAdmin = user?.role === 'admin';
            this.clientName = user?.name || '';
        });
    }

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
