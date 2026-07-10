import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-client-login',
    templateUrl: './client-login.component.html',
    styleUrls: ['./client-login.component.scss']
})
export class ClientLoginComponent {
    loginForm: FormGroup;
    loading = false;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.loading = true;
            const { email, password } = this.loginForm.value;

            this.authService.login(email, password).subscribe({
                next: (response) => {
                    this.snackBar.open('Login successful!', 'Close', { duration: 2000 });
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigate([returnUrl]);
                },
                error: (error) => {
                    this.loading = false;
                    this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
                }
            });
        }
    }
}
