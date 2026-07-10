import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, ApiResponse } from '@shared/models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = '/api/orders';

    constructor(private http: HttpClient) { }

    placeOrder(order: Partial<Order>): Observable<ApiResponse<Order>> {
        return this.http.post<ApiResponse<Order>>(this.apiUrl, order);
    }

    getMyOrders(): Observable<ApiResponse<Order[]>> {
        return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/me`);
    }

    // admin
    // admin endpoints return raw order documents which may include extra fields
    getAllOrders(): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(this.apiUrl);
    }

    updateOrderStatus(orderId: string, status: string): Observable<ApiResponse<Order>> {
        return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${orderId}/status`, { status });
    }
}
