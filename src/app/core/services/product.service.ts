import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, PaginatedResponse, ProductFilter, ApiResponse } from '@shared/models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = '/api/products';

    constructor(private http: HttpClient) { }

    // Get all products with filtering, sorting, and pagination
    getProducts(filter?: ProductFilter): Observable<PaginatedResponse<Product>> {
        let params = new HttpParams();

        if (filter) {
            if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
            if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
            if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
            if (filter.inStock !== undefined) params = params.set('inStock', filter.inStock.toString());
            if (filter.search) params = params.set('search', filter.search);
            if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
            if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
            if (filter.page) params = params.set('page', filter.page.toString());
            if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
        }

        return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
    }

    // Get featured products
    getFeaturedProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/featured`);
    }

    // Get single product by ID
    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    // Create new product (Admin)
    createProduct(product: Partial<Product>): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
    }

    // Update product (Admin)
    updateProduct(id: string, product: Partial<Product>): Observable<ApiResponse<Product>> {
        return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
    }

    // Delete product (Admin)
    deleteProduct(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }

    // Upload product image (Admin)
    uploadProductImage(id: string, image: File): Observable<ApiResponse<{ imageUrl: string }>> {
        const formData = new FormData();
        formData.append('image', image);
        return this.http.post<ApiResponse<{ imageUrl: string }>>(`${this.apiUrl}/${id}/image`, formData);
    }
}
