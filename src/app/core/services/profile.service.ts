import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    phoneNumber?: string;
    address?: Address;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    createdAt: string;
    updatedAt: string;
}

export interface ProfileResponse {
    success: boolean;
    user: UserProfile;
    message?: string;
}

export interface PasswordResponse {
    success: boolean;
    message: string;
}

export interface PictureResponse {
    success: boolean;
    profilePicture: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = '/api/profile';

    constructor(private http: HttpClient) { }

    getProfile(): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(this.apiUrl);
    }

    updateProfile(data: Partial<UserProfile>): Observable<ProfileResponse> {
        return this.http.put<ProfileResponse>(this.apiUrl, data);
    }

    changePassword(data: any): Observable<PasswordResponse> {
        return this.http.put<PasswordResponse>(`${this.apiUrl}/password`, data);
    }

    uploadProfilePicture(file: File): Observable<PictureResponse> {
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        return this.http.post<PictureResponse>(`${this.apiUrl}/picture`, formData);
    }
}
