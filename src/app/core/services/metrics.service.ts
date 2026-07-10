import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardMetrics {
    users: {
        totalCustomers: number;
        totalAdmins: number;
        totalUsers: number;
    };
    orders: {
        totalOrders: number;
        ordersByStatus: { [key: string]: number };
        totalRevenue: number;
        recentOrders: number;
        revenueByMonth: Array<{
            _id: { year: number; month: number };
            revenue: number;
            orders: number;
        }>;
        recentOrderDetails: Array<{
            _id: string;
            orderNumber?: string;
            total: number;
            status: string;
            createdAt: string;
            userId: { name: string; email: string };
        }>;
    };
    products: {
        totalProducts: number;
        inStockProducts: number;
        outOfStockProducts: number;
        featuredProducts: number;
        lowStockProducts: number;
        topSellingProducts: Array<{
            _id: string;
            name: string;
            totalSold: number;
            totalRevenue: number;
        }>;
    };
    categories: {
        totalCategories: number;
    };
    contacts: {
        totalContacts: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class MetricsService {
    private apiUrl = '/api/metrics';

    constructor(private http: HttpClient) { }

    getDashboardMetrics(): Observable<{ success: boolean; data: DashboardMetrics }> {
        return this.http.get<{ success: boolean; data: DashboardMetrics }>(`${this.apiUrl}/dashboard`);
    }

    getUserMetrics(): Observable<{ success: boolean; data: any }> {
        return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/users`);
    }

    getOrderMetrics(): Observable<{ success: boolean; data: any }> {
        return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/orders`);
    }

    getProductMetrics(): Observable<{ success: boolean; data: any }> {
        return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/products`);
    }
}