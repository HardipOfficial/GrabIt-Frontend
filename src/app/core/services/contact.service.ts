import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactForm, ApiResponse } from '@shared/models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private apiUrl = '/api/contact';

    constructor(private http: HttpClient) { }

    // Submit contact form
    submitContactForm(formData: ContactForm): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(this.apiUrl, formData);
    }
}
