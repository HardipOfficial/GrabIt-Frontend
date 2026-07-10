import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, ApiResponse } from '@shared/models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = '/api/categories';

    constructor(private http: HttpClient) { }

    // Get all categories
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }

    // Get single category by ID
    getCategoryById(id: string): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${id}`);
    }

    // Create new category (Admin)
    createCategory(category: Partial<Category>): Observable<ApiResponse<Category>> {
        return this.http.post<ApiResponse<Category>>(this.apiUrl, category);
    }

    // Update category (Admin)
    updateCategory(id: string, category: Partial<Category>): Observable<ApiResponse<Category>> {
        return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, category);
    }

    // Delete category (Admin)
    deleteCategory(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
