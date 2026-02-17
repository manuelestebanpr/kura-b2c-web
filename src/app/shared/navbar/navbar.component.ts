import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.currentUser());
  cartCount = computed(() => this.cartService.itemCount());
  userFirstName = computed(() => {
    const user = this.authService.currentUser();
    return user?.fullName?.split(' ')[0] ?? 'Usuario';
  });

  searchQuery = '';
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
