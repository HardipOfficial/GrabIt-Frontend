import { Component, OnInit } from '@angular/core';
import { MetricsService, DashboardMetrics } from '@core/services/metrics.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DashboardStats {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    inStockProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    pendingOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalContacts: number;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    stats: DashboardStats = {
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        inStockProducts: 0,
        outOfStockProducts: 0,
        lowStockProducts: 0,
        pendingOrders: 0,
        processingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalContacts: 0
    };
    metrics: DashboardMetrics | null = null;
    loading = true;

    constructor(
        private metricsService: MetricsService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadDashboardMetrics();
    }

    loadDashboardMetrics(): void {
        this.metricsService.getDashboardMetrics().subscribe({
            next: (response) => {
                if (response.success) {
                    this.metrics = response.data;
                    this.updateStats();
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load dashboard metrics', err);
                this.snackBar.open('Failed to load dashboard data', 'Close', { duration: 3000 });
                this.loading = false;
            }
        });
    }

    private updateStats(): void {
        if (!this.metrics) return;

        this.stats = {
            totalProducts: this.metrics.products.totalProducts,
            totalCategories: this.metrics.categories.totalCategories,
            totalOrders: this.metrics.orders.totalOrders,
            totalRevenue: this.metrics.orders.totalRevenue,
            totalCustomers: this.metrics.users.totalCustomers,
            inStockProducts: this.metrics.products.inStockProducts,
            outOfStockProducts: this.metrics.products.outOfStockProducts,
            lowStockProducts: this.metrics.products.lowStockProducts,
            pendingOrders: this.metrics.orders.ordersByStatus['pending'] || 0,
            processingOrders: this.metrics.orders.ordersByStatus['processing'] || 0,
            deliveredOrders: this.metrics.orders.ordersByStatus['delivered'] || 0,
            cancelledOrders: this.metrics.orders.ordersByStatus['cancelled'] || 0,
            totalContacts: this.metrics.contacts.totalContacts
        };
    }
}
