import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { CartItem } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    loading = true;

    constructor(
        private cartService: CartService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart(): void {
        this.cartService.getCartItems().subscribe({
            next: (items) => {
                this.cartItems = items;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading cart:', error);
                this.loading = false;
            }
        });
    }

    updateQuantity(itemId: string, quantity: number): void {
        if (quantity < 1) return;

        this.cartService.updateQuantity(itemId, quantity).subscribe({
            next: () => {
                this.snackBar.open('Cart updated', 'Close', { duration: 2000 });
            },
            error: () => {
                this.snackBar.open('Failed to update cart', 'Close', { duration: 3000 });
            }
        });
    }

    removeItem(itemId: string): void {
        this.cartService.removeFromCart(itemId).subscribe({
            next: () => {
                this.snackBar.open('Item removed from cart', 'Close', { duration: 2000 });
            },
            error: () => {
                this.snackBar.open('Failed to remove item', 'Close', { duration: 3000 });
            }
        });
    }

    get cartTotal(): number {
        return this.cartService.getCartTotal();
    }

    proceedToCheckout(): void {
        // navigate to checkout page
        this.router.navigate(['/checkout']);
    }
}
