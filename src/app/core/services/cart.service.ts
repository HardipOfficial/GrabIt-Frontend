import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartItem, Product, ApiResponse } from '@shared/models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = '/api/cart';
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    public cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadCart();
    }

    // Load cart from backend
    loadCart(): void {
        this.http.get<CartItem[]>(this.apiUrl).subscribe({
            next: (items) => this.cartItemsSubject.next(items),
            error: () => this.cartItemsSubject.next([])
        });
    }

    // Get cart items
    getCartItems(): Observable<CartItem[]> {
        return this.cartItems$;
    }

    // Add item to cart
    addToCart(product: Product, quantity: number = 1): Observable<ApiResponse<CartItem>> {
        return this.http.post<ApiResponse<CartItem>>(this.apiUrl, {
            productId: product.id || (product as any)._id,
            quantity
        }).pipe(
            tap(() => this.loadCart())
        );
    }

    // Update cart item quantity
    updateQuantity(itemId: string, quantity: number): Observable<ApiResponse<CartItem>> {
        return this.http.put<ApiResponse<CartItem>>(`${this.apiUrl}/${itemId}`, { quantity }).pipe(
            tap(() => this.loadCart())
        );
    }

    // Remove item from cart
    removeFromCart(itemId: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${itemId}`).pipe(
            tap(() => this.loadCart())
        );
    }

    // Clear cart
    clearCart(): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/clear`).pipe(
            tap(() => this.cartItemsSubject.next([]))
        );
    }

    // Get cart total
    getCartTotal(): number {
        const items = this.cartItemsSubject.value;
        return items.reduce((total, item) => total + item.subtotal, 0);
    }

    // Get cart item count
    getCartItemCount(): number {
        const items = this.cartItemsSubject.value;
        return items.reduce((count, item) => count + item.quantity, 0);
    }

    // Get cart item count observable
    getCartItemCount$(): Observable<number> {
        return new Observable(observer => {
            this.cartItems$.subscribe(items => {
                const count = items.reduce((total, item) => total + item.quantity, 0);
                observer.next(count);
            });
        });
    }
}
