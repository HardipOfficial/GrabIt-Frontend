import { Component, OnInit } from '@angular/core';
import { OrderService } from '@core/services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-my-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    orders: any[] = [];
    loading = true;

    constructor(
        private orderService: OrderService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.orderService.getMyOrders().subscribe({
            next: res => {
                if (res.success) {
                    this.orders = res.data;
                }
                this.loading = false;
            },
            error: err => {
                console.error('Failed to fetch orders', err);
                if (err.status === 401) {
                    // not logged in
                    window.location.href = '/auth/login';
                } else {
                    this.snackBar.open('Unable to load orders', 'Close', { duration: 3000 });
                }
                this.loading = false;
            }
        });
    }

    /**
     * Convert raw payment method code into a human-friendly label.
     * Falls back to the raw string if unknown.
     */
    getPaymentLabel(method?: string): string {
        if (!method) {
            return 'Unknown';
        }
        switch (method) {
            case 'cod':
                return 'Cash on Delivery';
            case 'online':
                return 'Online';
            default:
                return method;
        }
    }
}
