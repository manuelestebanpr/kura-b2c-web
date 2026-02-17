import { Injectable, signal, computed } from '@angular/core';
import { CartItem, SearchResponse } from '../models/api.models';

const STORAGE_CART_KEY = 'kura_cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = computed(() => this._items());
  readonly itemCount = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.service.basePrice * item.quantity, 0)
  );
  readonly currentPosId = computed(() => {
    const items = this._items();
    return items.length > 0 ? items[0].posId : null;
  });

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cartJson = localStorage.getItem(STORAGE_CART_KEY);
      if (cartJson) {
        try {
          this._items.set(JSON.parse(cartJson));
        } catch (e) {
          console.error('Failed to parse cart from storage', e);
        }
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(this._items()));
    }
  }

  addItem(service: SearchResponse, posId: string, posName: string, quantity: number = 1): { cleared: boolean; message?: string } {
    const currentItems = this._items();
    const existingPosId = currentItems.length > 0 ? currentItems[0].posId : null;

    // Check if adding from different PoS
    if (existingPosId && existingPosId !== posId) {
      // Clear cart and add new item
      this._items.set([{ service, posId, posName, quantity }]);
      this.saveToStorage();
      return {
        cleared: true,
        message: 'El carrito se ha vaciado porque seleccionaste un laboratorio diferente.',
      };
    }

    // Check if item already exists
    const existingIndex = currentItems.findIndex(item => item.service.code === service.code);
    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
      this._items.set(updated);
    } else {
      this._items.set([...currentItems, { service, posId, posName, quantity }]);
    }

    this.saveToStorage();
    return { cleared: false };
  }

  removeItem(index: number): void {
    const current = this._items();
    if (index >= 0 && index < current.length) {
      this._items.set(current.filter((_, i) => i !== index));
      this.saveToStorage();
    }
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity < 1) return;
    const current = this._items();
    if (index >= 0 && index < current.length) {
      const updated = [...current];
      updated[index] = { ...updated[index], quantity };
      this._items.set(updated);
      this.saveToStorage();
    }
  }

  getItems(): CartItem[] {
    return this._items();
  }

  clear(): void {
    this._items.set([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_CART_KEY);
    }
  }
}
