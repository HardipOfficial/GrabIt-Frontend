import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '@core/services/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
    contactForm: FormGroup;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private contactService: ContactService,
        private snackBar: MatSnackBar
    ) {
        this.contactForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            message: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    onSubmit(): void {
        if (this.contactForm.valid) {
            this.submitting = true;
            this.contactService.submitContactForm(this.contactForm.value).subscribe({
                next: () => {
                    this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000 });
                    this.contactForm.reset();
                    this.submitting = false;
                },
                error: (error) => {
                    this.snackBar.open('Failed to send message. Please try again.', 'Close', { duration: 3000 });
                    this.submitting = false;
                }
            });
        }
    }
}
