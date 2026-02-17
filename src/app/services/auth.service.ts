import { Injectable, signal, computed } from '@angular/core';

export interface AuthUser {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

const STORAGE_USER_KEY = 'kura_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = signal<AuthUser | null>(null);

  readonly isLoggedIn = computed(() => !!this._user());
  readonly currentUser = computed(() => this._user());

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem(STORAGE_USER_KEY);
      if (userJson) {
        try {
          this._user.set(JSON.parse(userJson));
        } catch (e) {
          console.error('Failed to parse user from storage', e);
        }
      }
    }
  }

  setAuth(user: AuthUser): void {
    this._user.set(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): AuthUser | null {
    return this._user();
  }

  logout(): void {
    this._user.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
    // Cookie will be cleared by the server or by expiry
  }
}
