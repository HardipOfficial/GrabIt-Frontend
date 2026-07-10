import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, User } from '@shared/models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';
    private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Get user from localStorage on init
    private getUserFromStorage(): User | null {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    // User Login
    register(name: string, email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password }).pipe(
            tap(response => {
                this.setSession(response);
            })
        );
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(response => {
                this.setSession(response);
            })
        );
    }

    // Admin Login
    adminLogin(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/admin/login`, { email, password }).pipe(
            tap(response => {
                this.setSession(response);
            })
        );
    }

    // Set session data
    private setSession(authResponse: AuthResponse): void {
        localStorage.setItem('token', authResponse.token);
        localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
        this.currentUserSubject.next(authResponse.user);
    }

    // Logout
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    // Get token
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Check if user is logged in
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    // Check if user is admin
    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user?.role === 'admin';
    }

    // Get current user value (synchronous)
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    // Update current user in storage and subject (for profile updates)
    updateCurrentUser(user: User): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
