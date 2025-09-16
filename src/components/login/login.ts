import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/LoginService/login-service';

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
 userData = { email: "", password: "" };
   userObj: any;
     loginError = "";

  constructor(private fb: FormBuilder,  private router: Router,
    private _loginService: LoginService,) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
     
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
    onSubmit(): void {
    this.loginForm.markAllAsTouched();
    this.userData = {
      email: this.loginForm.controls["email"].value
        ? this.loginForm.controls["email"].value
        : "",
      password: this.loginForm.controls["password"].value
        ? this.loginForm.controls["password"].value
        : "",
    };
    this.login();
  }
    login() {
    this._loginService.authenticateUser(this.userData).subscribe({
      next: (user) => {
        this.userObj = user;
        if (this.userObj && this.userObj.Error == null) {
          this.loginSuccessful();
          // this.router.navigate(['/home'])
        } else {
          this.showErrorMessage(this.userObj.Error);
          this.router.navigate(["/login"]);
        }
      },
      error: (err) => {
        console.error("Error", err);
        this.showErrorMessage(this.loginError);
      },
    });
  }
    loginSuccessful() {
    if (this.userData.email == this.userObj?.additionalData?.loginId) {
      this._loginService
        .fetchUserDetails(this.userObj.additionalData?.emailId)
        .subscribe({
          next: (data) => {
            if (data.length) {
              sessionStorage.setItem("userDetails", JSON.stringify(data[0]));
              if (sessionStorage.getItem("userDetails")) {
                this.router.navigate(['/home'])
                // this.navigateToDefaultPage(data[0]?.role, data[0]?.loginId);
                // this.router.navigate(['/home/tenderList'])
              }
              this._loginService.loggedInUserDetails.next(Object(data[0]));
            }
          },
        });
    } else {
      this.showErrorMessage(this.loginError);
    }
  }
  
}