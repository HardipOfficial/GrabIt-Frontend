import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-client-register',
    templateUrl: './client-register.component.html',
    styleUrls: ['./client-register.component.scss']
})
export class ClientRegisterComponent {
    registerForm: FormGroup;
    loading = false;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.loading = true;
            const { name, email, password } = this.registerForm.value;

            this.authService.register(name, email, password).subscribe({
                next: (response) => {
                    this.snackBar.open('Registration successful!', 'Close', { duration: 2000 });
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigate([returnUrl]);
                },
                error: (error) => {
                    this.loading = false;
                    const msg = error.error?.message || 'Registration failed. Please try again.';
                    this.snackBar.open(msg, 'Close', { duration: 3000 });
                }
            });
        }
    }
}
