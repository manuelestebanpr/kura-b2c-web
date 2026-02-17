import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/api.models';

const STORAGE_TOKEN_KEY = 'kura_token';
const STORAGE_USER_KEY = 'kura_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token = signal<string | null>(null);
  private _user = signal<User | null>(null);

  readonly isLoggedIn = computed(() => !!this._token());
  readonly currentUser = computed(() => this._user());
  readonly token = computed(() => this._token());

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem(STORAGE_TOKEN_KEY);
      const userJson = localStorage.getItem(STORAGE_USER_KEY);
      if (token) this._token.set(token);
      if (userJson) {
        try {
          this._user.set(JSON.parse(userJson));
        } catch (e) {
          console.error('Failed to parse user from storage', e);
        }
      }
    }
  }

  setAuth(token: string, user: User): void {
    this._token.set(token);
    this._user.set(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    }
  }

  getToken(): string | null {
    return this._token();
  }

  getUser(): User | null {
    return this._user();
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }
}
