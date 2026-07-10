import { Component, OnInit } from '@angular/core';
import { OrderService } from '@core/services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// we adapt the Order interface from shared; user info may come as nested object


@Component({
    selector: 'app-order-management',
    templateUrl: './order-management.component.html',
    styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
    orders: any[] = []; // will hold raw orders from API
    displayedColumns: string[] = ['orderNumber', 'customer', 'deliveryAddress', 'items', 'total', 'status', 'date', 'actions'];

    constructor(
        private orderService: OrderService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.orderService.getAllOrders().subscribe({
            next: res => {
                if (res.success) {
                    // transform orders to add orderNumber / customerName etc
                    this.orders = res.data.map(o => ({
                        ...o,
                        orderNumber: `ORD-${o._id.slice(-6).toUpperCase()}`,
                        customerName: o.userId?.name || o.userId?.email || 'Unknown',
                        deliveryAddress: o.deliveryAddress || 'N/A',
                        date: o.createdAt,
                        itemsCount: Array.isArray(o.items) ? o.items.length : 0,
                        itemNames: Array.isArray(o.items) ? o.items.map((i: any) => i.name).join(', ') : '',
                        paymentMethodDisplay: o.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'
                    }));
                }
            },
            error: err => {
                console.error('Failed to load orders', err);
                this.snackBar.open('Unable to fetch orders', 'Close', { duration: 3000 });
            }
        });
    }

    updateOrderStatus(order: any, newStatus: string): void {
        this.orderService.updateOrderStatus(order._id || order.id, newStatus).subscribe({
            next: res => {
                if (res.success) {
                    order.status = res.data.status;
                    this.snackBar.open('Status updated', 'Close', { duration: 2000 });
                }
            },
            error: err => {
                console.error('Status update failed', err);
                this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
            }
        });
    }

    getStatusClass(status: string): string {
        return `status-${status}`;
    }
}
