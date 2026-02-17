import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CartItem, OrderResponse } from '../../models/api.models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  cartItems = signal<CartItem[]>([]);
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.currentUser());
  loading = signal(false);
  error = signal<string | null>(null);
  orderComplete = signal(false);
  createdOrder = signal<OrderResponse | null>(null);

  guestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.guestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
    });
  }

  ngOnInit(): void {
    this.cartItems.set(this.cartService.getItems());

    // Redirect if cart is empty
    if (this.cartItems().length === 0 && !this.orderComplete()) {
      // Keep them on page to show empty state
    }
  }

  getTotal(): number {
    return this.cartService.total();
  }

  getPosName(): string {
    const items = this.cartItems();
    return items.length > 0 ? items[0].posName || 'Laboratorio seleccionado' : '';
  }

  updateQuantity(index: number, delta: number): void {
    const item = this.cartItems()[index];
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(index, newQuantity);
      this.cartItems.set(this.cartService.getItems());
    }
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
    this.cartItems.set(this.cartService.getItems());
  }

  createOrder(): void {
    if (!this.isLoggedIn()) {
      if (this.guestForm.invalid) {
        this.guestForm.markAllAsTouched();
        return;
      }
    }

    const items = this.cartItems();
    if (items.length === 0) {
      this.error.set('El carrito está vacío');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const orderData = {
      items: items.map((item) => ({
        serviceCode: item.service.code,
        quantity: item.quantity,
      })),
      posId: items[0].posId,
      ...(this.isLoggedIn()
        ? {}
        : {
            patientEmail: this.guestForm.value.email,
            patientCedula: this.guestForm.value.cedula,
          }),
    };

    this.apiService.createOrder(orderData).subscribe({
      next: (order) => {
        this.loading.set(false);
        this.createdOrder.set(order);
        this.orderComplete.set(true);
        this.cartService.clear();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al crear la orden. Intenta de nuevo.');
      },
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }
}
