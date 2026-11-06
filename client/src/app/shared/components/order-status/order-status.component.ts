import { Component, Input, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

type OrderStatusType = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface StatusConfig {
  label: string;
  icon: string;
  colorClass: string;
  bgColorClass: string;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="order-status"
      [class]="statusClasses()"
      [matTooltip]="statusTooltip()"
    >
      <mat-icon class="order-status__icon">{{ currentConfig().icon }}</mat-icon>
      <span class="order-status__label">{{ currentConfig().label }}</span>
      <span class="order-status__time" *ngIf="statusUpdatedAt">
        {{ formatTimeAgo(statusUpdatedAt) }}
      </span>
    </div>
  `,
  styles: [`
    .order-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border-radius: 16px;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: default;

      &__icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &__label {
        white-space: nowrap;
      }

      &__time {
        font-size: 0.75rem;
        opacity: 0.8;
        margin-left: 0.25rem;
      }

      &--pending {
        background-color: #fff3e0;
        color: #e65100;
        border: 1px solid #ffb74d;
      }

      &--confirmed {
        background-color: #e3f2fd;
        color: #1565c0;
        border: 1px solid #64b5f6;
      }

      &--processing {
        background-color: #f3e5f5;
        color: #7b1fa2;
        border: 1px solid #ba68c8;
      }

      &--shipped {
        background-color: #e8f5e9;
        color: #2e7d32;
        border: 1px solid #81c784;
      }

      &--delivered {
        background-color: #e8f5e9;
        color: #1b5e20;
        border: 1px solid #4caf50;
      }

      &--cancelled {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #ef5350;
      }
    }
  `]
})
export class OrderStatusComponent {
  @Input({ required: true }) status!: OrderStatusType;
  @Input() statusUpdatedAt?: Date | string;

  private readonly statusConfigs: Record<OrderStatusType, StatusConfig> = {
    PENDING: {
      label: 'Pendiente',
      icon: 'hourglass_empty',
      colorClass: 'pending',
      bgColorClass: 'bg-pending'
    },
    CONFIRMED: {
      label: 'Confirmada',
      icon: 'check_circle',
      colorClass: 'confirmed',
      bgColorClass: 'bg-confirmed'
    },
    PROCESSING: {
      label: 'Procesando',
      icon: 'sync',
      colorClass: 'processing',
      bgColorClass: 'bg-processing'
    },
    SHIPPED: {
      label: 'Enviada',
      icon: 'local_shipping',
      colorClass: 'shipped',
      bgColorClass: 'bg-shipped'
    },
    DELIVERED: {
      label: 'Entregada',
      icon: 'done_all',
      colorClass: 'delivered',
      bgColorClass: 'bg-delivered'
    },
    CANCELLED: {
      label: 'Cancelada',
      icon: 'cancel',
      colorClass: 'cancelled',
      bgColorClass: 'bg-cancelled'
    }
  };

  readonly currentConfig = computed(() => {
    return this.statusConfigs[this.status] || this.statusConfigs.PENDING;
  });

  readonly statusClasses = computed(() => {
    const config = this.currentConfig();
    return `order-status order-status--${config.colorClass}`;
  });

  readonly statusTooltip = computed(() => {
    const config = this.currentConfig();
    let tooltip = config.label;
    if (this.statusUpdatedAt) {
      tooltip += ` - Actualizado: ${this.formatDate(this.statusUpdatedAt)}`;
    }
    return tooltip;
  });

  formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    if (diffDays < 7) return `hace ${diffDays} días`;
    return this.formatDate(date);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}