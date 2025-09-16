import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  @Output() loginSuccess = new EventEmitter<any>();
  @Output() navigateToSignup = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<string>();

  loginForm!: FormGroup;
  showPassword = false;
  isSubmitting = false;
  showErrorToast = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        const formValue = this.loginForm.value;
        
        // Mock authentication logic
        if (formValue.email === 'admin@example.com' && formValue.password === 'password123') {
          // Successful login
          const userData = {
            email: formValue.email,
            name: 'Admin User',
            rememberMe: formValue.rememberMe
          };
          
          this.loginSuccess.emit(userData);
          this.isSubmitting = false;
        } else {
          // Failed login
          this.showErrorMessage('Invalid email or password. Please try again.');
          this.isSubmitting = false;
        }
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    const email = this.loginForm.get('email')?.value;
    this.forgotPassword.emit(email);
  }

  onSignUp(event: Event): void {
    event.preventDefault();
    this.navigateToSignup.emit();
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showErrorToast = true;
    
    setTimeout(() => {
      this.showErrorToast = false;
    }, 4000);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}