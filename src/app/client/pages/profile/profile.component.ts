import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService, UserProfile } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  activeTab: 'info' | 'password' = 'info';

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  userProfile: UserProfile | null = null;
  isLoading = true;
  isSubmitting = false;

  successMessage = '';
  errorMessage = '';

  apiUrl = ''; // API base is handled by proxy/server relative to root

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
  }

  initForms() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: [''],
      dateOfBirth: [''],
      gender: ['prefer-not-to-say'],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      })
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  loadProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.user) {
          this.userProfile = res.user;

          // Format date for input[type="date"]
          let dateStr = '';
          if (this.userProfile.dateOfBirth) {
            const date = new Date(this.userProfile.dateOfBirth);
            dateStr = date.toISOString().split('T')[0];
          }

          this.profileForm.patchValue({
            name: this.userProfile.name,
            phoneNumber: this.userProfile.phoneNumber || '',
            dateOfBirth: dateStr,
            gender: this.userProfile.gender || 'prefer-not-to-say',
            address: {
              street: this.userProfile.address?.street || '',
              city: this.userProfile.address?.city || '',
              state: this.userProfile.address?.state || '',
              zipCode: this.userProfile.address?.zipCode || '',
              country: this.userProfile.address?.country || ''
            }
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.errorMessage = 'Failed to load profile data.';
        this.isLoading = false;
      }
    });
  }

  getProfileImageSource(): string {
    if (this.userProfile?.profilePicture) {
      // Ensure the path starts with a slash if it doesn't already
      const path = this.userProfile.profilePicture.startsWith('/') 
        ? this.userProfile.profilePicture 
        : '/' + this.userProfile.profilePicture;
      return path;
    }
    return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isSubmitting = true;
      this.clearMessages();

      this.profileService.uploadProfilePicture(file).subscribe({
        next: (res) => {
          if (res.success && this.userProfile) {
            this.userProfile.profilePicture = res.profilePicture;
            this.showSuccess('Profile picture updated successfully!');
            // Propagate change to auth service if it holds currentUser
            const currentUser = this.authService.currentUserValue;
            if (currentUser) {
              this.authService.updateCurrentUser({ ...currentUser, profilePicture: res.profilePicture });
            }
          }
          this.isSubmitting = false;
        },
        error: (err) => {
          this.showError(err.error?.message || 'Failed to upload picture.');
          this.isSubmitting = false;
        }
      });
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;
    this.clearMessages();

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.userProfile = res.user;
          this.showSuccess('Profile updated successfully!');

          const currentUser = this.authService.currentUserValue;
          if (currentUser) {
            this.authService.updateCurrentUser({ ...currentUser, name: res.user.name });
          }
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.showError(err.error?.message || 'Failed to update profile.');
        this.isSubmitting = false;
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    this.isSubmitting = true;
    this.clearMessages();

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.profileService.changePassword({ currentPassword, newPassword }).subscribe({
      next: (res) => {
        if (res.success) {
          this.showSuccess('Password changed successfully!');
          this.passwordForm.reset();
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.showError(err.error?.message || 'Failed to change password.');
        this.isSubmitting = false;
      }
    });
  }

  switchTab(tab: 'info' | 'password') {
    this.activeTab = tab;
    this.clearMessages();
  }

  private showSuccess(msg: string) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 5000);
  }

  private showError(msg: string) {
    this.errorMessage = msg;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
