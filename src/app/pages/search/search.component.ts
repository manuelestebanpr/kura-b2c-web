import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { SearchResponse, PosResponse } from '../../models/api.models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  searchResults = signal<SearchResponse[]>([]);
  posLocations = signal<PosResponse[]>([]);
  selectedPos = signal<string>('');
  loading = signal(false);
  error = signal<string | null>(null);
  expandedService = signal<string | null>(null);
  selectedForCompare = signal<string[]>([]);
  showComparison = signal(false);
  cartWarning = signal<string | null>(null);

  private searchSubject = new Subject<string>();

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load PoS locations
    this.apiService.getPosLocations().subscribe({
      next: (pos) => this.posLocations.set(pos),
      error: () => this.error.set('COMMON.ERROR'),
    });

    // Setup search debounce
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.performSearch(query);
      });

    // Check for query param
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.searchSubject.next(this.searchQuery);
      }
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(query: string): void {
    if (!query.trim()) {
      this.searchResults.set([]);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.apiService.searchServices(query, this.selectedPos() || undefined).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('COMMON.ERROR');
        this.loading.set(false);
      },
    });
  }

  toggleExpand(serviceCode: string): void {
    this.expandedService.set(this.expandedService() === serviceCode ? null : serviceCode);
  }

  toggleCompare(serviceCode: string): void {
    const current = this.selectedForCompare();
    if (current.includes(serviceCode)) {
      this.selectedForCompare.set(current.filter((c) => c !== serviceCode));
    } else if (current.length < 3) {
      this.selectedForCompare.set([...current, serviceCode]);
    }
  }

  getSelectedBundles(): SearchResponse[] {
    const codes = this.selectedForCompare();
    return this.searchResults().filter((s) => codes.includes(s.code) && s.serviceType === 'BUNDLE');
  }

  addToCart(service: SearchResponse): void {
    const posId = this.selectedPos();
    if (!posId) {
      // Error message will be shown in template using translate pipe
      this.error.set('SEARCH.SELECT_LAB_FIRST');
      return;
    }

    const pos = this.posLocations().find((p) => p.id === posId);
    const result = this.cartService.addItem(service, posId, pos?.name || 'Laboratorio', 1);

    if (result.cleared) {
      this.cartWarning.set(result.message || null);
      setTimeout(() => this.cartWarning.set(null), 5000);
    }
  }

  // Bundle item comparison is not yet available — the search API returns flat results
  // without nested bundle items. These will be populated in Phase 2 when the API
  // includes bundle composition in search results.
  getBundleItemNames(_service: SearchResponse): string[] {
    return [];
  }

  getAllUniqueItemsFromBundles(_bundles: SearchResponse[]): string[] {
    return [];
  }

  bundleHasItem(_bundle: SearchResponse, _itemName: string): boolean {
    return false;
  }
}
