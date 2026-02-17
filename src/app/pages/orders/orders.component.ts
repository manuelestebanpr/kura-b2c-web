import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, AuthUser } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { OrderResponse } from '../../models/api.models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders = signal<OrderResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  expandedOrder = signal<string | null>(null);
  currentUser = signal<AuthUser | null>(null);

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.currentUser.set(user);
    this.loadOrders(user.userId);
  }

  loadOrders(userId: string): void {
    this.loading.set(true);
    this.apiService.getUserOrders(userId).subscribe({
      next: (orders) => {
        this.orders.set(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar tus órdenes. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  toggleExpand(orderNumber: string): void {
    this.expandedOrder.set(this.expandedOrder() === orderNumber ? null : orderNumber);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800';
      case 'PAID':
        return 'bg-sky-100 text-sky-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PAID':
        return 'Pagado';
      case 'IN_PROGRESS':
        return 'En proceso';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
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
}
