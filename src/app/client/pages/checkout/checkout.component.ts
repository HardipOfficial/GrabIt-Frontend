import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { OrderService } from '@core/services/order.service';
import { PaymentService, RazorpayOrder } from '@core/services/payment.service';
import { ProfileService } from '@core/services/profile.service';
import { CartItem, Order, User } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    cartItems: CartItem[] = [];
    loading = true;
    processingPayment = false;
    houseNumber = '';
    street = '';
    city = '';
    state = '';
    pinCode = '';
    paymentMethod: 'cod' | 'online' = 'cod'; // cod = Cash on Delivery, online = Razorpay
    customerEmail = '';
    customerName = '';
    
    // Address Selection
    addressOption: 'profile' | 'manual' = 'profile';
    savedAddress: any = null;
    profileLoading = true;

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private paymentService: PaymentService,
        private profileService: ProfileService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCart();
        this.loadProfile();
    }

    loadCart(): void {
        this.cartService.getCartItems().subscribe({
            next: (items) => {
                this.cartItems = items;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading cart:', err);
                this.loading = false;
            }
        });
    }

    loadProfile(): void {
        this.profileService.getProfile().subscribe({
            next: (response) => {
                const profile = response.user;
                this.savedAddress = profile.address;
                this.customerName = profile.name || '';
                this.customerEmail = profile.email || '';
                
                // If profile has an address, use it as default
                if (this.hasSavedAddress()) {
                    this.addressOption = 'profile';
                    this.populateFromProfile();
                } else {
                    this.addressOption = 'manual';
                }
                this.profileLoading = false;
            },
            error: (err) => {
                console.error('Error loading profile:', err);
                this.addressOption = 'manual';
                this.profileLoading = false;
            }
        });
    }

    hasSavedAddress(): boolean {
        return !!(this.savedAddress && (this.savedAddress.street || this.savedAddress.city || this.savedAddress.zipCode));
    }

    onAddressOptionChange(): void {
        if (this.addressOption === 'profile') {
            this.populateFromProfile();
        } else {
            this.clearManualAddress();
        }
    }

    private populateFromProfile(): void {
        if (this.savedAddress) {
            this.street = this.savedAddress.street || '';
            this.city = this.savedAddress.city || '';
            this.state = this.savedAddress.state || '';
            this.pinCode = this.savedAddress.zipCode || '';
            this.houseNumber = ''; 
        }
    }

    private clearManualAddress(): void {
        this.houseNumber = '';
        this.street = '';
        this.city = '';
        this.state = '';
        this.pinCode = '';
    }

    get cartTotal(): number {
        return this.cartService.getCartTotal();
    }

    get deliveryAddress(): string {
        const parts = [this.houseNumber, this.street, this.city, this.state, this.pinCode].filter(part => part.trim());
        return parts.join(', ');
    }

    isFormValid(): boolean {
        if (this.addressOption === 'profile') {
            return this.hasSavedAddress();
        }
        return this.houseNumber.trim().length > 0 && this.city.trim().length > 0 && this.pinCode.trim().length > 0;
    }

    placeOrder(): void {
        if (this.cartItems.length === 0) {
            this.snackBar.open('Cart is empty', 'Close', { duration: 2000 });
            return;
        }

        if (this.paymentMethod === 'cod') {
            this.submitCashOnDeliveryOrder();
        } else if (this.paymentMethod === 'online') {
            this.submitOnlinePaymentOrder();
        }
    }

    private submitCashOnDeliveryOrder(): void {
        const orderPayload: Partial<Order> = {
            items: this.cartItems.map(item => ({
                productId: item.product.id || (item.product as any)._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            total: this.cartTotal,
            deliveryAddress: this.deliveryAddress,
            paymentMethod: 'cod'
        };

        this.orderService.placeOrder(orderPayload).subscribe({
            next: () => {
                this.snackBar.open('Order placed successfully', 'Close', { duration: 3000 });
                this.cartService.clearCart().subscribe();
                this.router.navigate(['/']);
            },
            error: () => {
                this.snackBar.open('Failed to place order', 'Close', { duration: 3000 });
            }
        });
    }

    private submitOnlinePaymentOrder(): void {
        if (!this.customerEmail.trim() || !this.customerName.trim()) {
            this.snackBar.open('Please provide your name and email', 'Close', { duration: 2000 });
            return;
        }

        this.processingPayment = true;

        // Step 1: Create Razorpay order
        this.paymentService.createPaymentOrder(this.cartTotal).subscribe({
            next: (response) => {
                if (response.success && response.order && response.keyId) {
                    // Step 2: Open Razorpay payment modal
                    this.openRazorpayPayment(response.order, response.keyId);
                } else {
                    this.processingPayment = false;
                    this.snackBar.open('Failed to create payment order', 'Close', { duration: 3000 });
                }
            },
            error: (error) => {
                this.processingPayment = false;
                console.error('Error creating payment order:', error);
                this.snackBar.open('Failed to initiate payment', 'Close', { duration: 3000 });
            }
        });
    }

    private openRazorpayPayment(orderDetails: RazorpayOrder, keyId: string): void {
        this.paymentService.openRazorpayModal(
            orderDetails,
            keyId,
            this.customerEmail,
            this.customerName,
            (response) => this.handlePaymentSuccess(response, orderDetails.id),
            (error) => this.handlePaymentFailure(error)
        );
    }

    private handlePaymentSuccess(paymentResponse: any, orderId: string): void {
        // Step 3: Payment successful, create order in backend
        const orderPayload: Partial<Order> = {
            items: this.cartItems.map(item => ({
                productId: item.product.id || (item.product as any)._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            total: this.cartTotal,
            deliveryAddress: this.deliveryAddress,
            paymentMethod: 'online',
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature
        };

        this.orderService.placeOrder(orderPayload).subscribe({
            next: () => {
                this.processingPayment = false;
                this.snackBar.open('Order placed successfully! Payment confirmed.', 'Close', { duration: 3000 });
                this.cartService.clearCart().subscribe();
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.processingPayment = false;
                console.error('Error placing order:', error);
                this.snackBar.open('Order creation failed after payment', 'Close', { duration: 3000 });
            }
        });
    }

    private handlePaymentFailure(error: any): void {
        this.processingPayment = false;
        console.error('Payment failed:', error);
        this.snackBar.open('Payment failed. Please try again.', 'Close', { duration: 3000 });
    }
}
