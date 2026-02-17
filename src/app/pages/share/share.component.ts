import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { ShareResponse } from '../../models/api.models';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './share.component.html',
})
export class ShareComponent implements OnInit {
  shareData = signal<ShareResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  expired = signal(false);

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      this.error.set('Enlace inválido');
      this.loading.set(false);
      return;
    }

    this.loadSharedResult(uuid);
  }

  loadSharedResult(uuid: string): void {
    this.apiService.getSharedResult(uuid).subscribe({
      next: (data) => {
        // Check if expired
        const expiresAt = new Date(data.expiresAt);
        if (expiresAt < new Date()) {
          this.expired.set(true);
        } else {
          this.shareData.set(data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404 || err.status === 410) {
          this.expired.set(true);
        } else {
          this.error.set('Error al cargar el resultado. Intenta de nuevo.');
        }
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
}
