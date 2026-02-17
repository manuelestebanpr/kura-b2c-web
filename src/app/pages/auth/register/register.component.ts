import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

type RegisterStep = 'email' | 'otp' | 'form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  currentStep = signal<RegisterStep>('email');
  loading = signal(false);
  error = signal<string | null>(null);
  email = signal<string>('');
  otpVerified = signal(false);

  // Step 1: Email form
  emailForm: FormGroup;

  // Step 2: OTP form
  otpForm: FormGroup;

  // Step 3: Full registration form
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.registerForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      acceptTerms: [false, [Validators.requiredTrue]],
    });
  }

  sendOtp(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const emailValue = this.emailForm.value.email;
    this.email.set(emailValue);

    this.apiService.sendOtp(emailValue).subscribe({
      next: () => {
        this.loading.set(false);
        this.currentStep.set('otp');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al enviar el código. Intenta de nuevo.');
      },
    });
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.apiService.verifyOtp(this.email(), this.otpForm.value.code).subscribe({
      next: () => {
        this.loading.set(false);
        this.otpVerified.set(true);
        this.currentStep.set('form');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Código incorrecto. Verifica e intenta de nuevo.');
      },
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const data = {
      email: this.email(),
      password: this.registerForm.value.password,
      fullName: this.registerForm.value.fullName,
      cedula: this.registerForm.value.cedula,
      phone: this.registerForm.value.phone || undefined,
    };

    this.apiService.register(data).subscribe({
      next: (response) => {
        this.authService.setAuth({
          userId: response.user.id,
          email: response.user.email,
          fullName: response.user.fullName,
          role: 'USER'
        });
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al crear la cuenta. Intenta de nuevo.');
      },
    });
  }

  goBack(): void {
    if (this.currentStep() === 'otp') {
      this.currentStep.set('email');
    } else if (this.currentStep() === 'form') {
      this.currentStep.set('otp');
    }
    this.error.set(null);
  }
}
