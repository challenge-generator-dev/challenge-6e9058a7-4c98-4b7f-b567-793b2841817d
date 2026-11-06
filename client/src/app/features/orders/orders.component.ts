import { Component, OnInit, OnDestroy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil, interval, Subscription } from 'rxjs';

import { OrderEventService } from '../../core/services/order-event.service';
import { Order, OrderItem, OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../../shared/models/order.model';
import { OrderStatusComponent } from '../../shared/components/order-status/order-status.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    OrderStatusComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly orderEventService = inject(OrderEventService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();
  private pollingSubscription: Subscription | null = null;

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly selectedOrderId = signal<string | null>(null);
  readonly isConnected = signal<boolean>(false);

  readonly sortedOrders = computed(() => {
    const ordersList = this.orders();
    return [...ordersList].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  });

  readonly pendingOrders = computed(() => {
    return this.orders().filter(order => order.status === 'pending' || order.status === 'processing');
  });

  readonly completedOrders = computed(() => {
    return this.orders().filter(order => order.status === 'completed' || order.status === 'delivered');
  });

  readonly cancelledOrders = computed(() => {
    return this.orders().filter(order => order.status === 'cancelled');
  });

  constructor() {
    effect(() => {
      const connectionStatus = this.isConnected();
      if (connectionStatus) {
        this.snackBar.open('Conectado al stream de eventos en tiempo real', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const orderId = params.get('id');
        this.selectedOrderId.set(orderId);
      });

    this.loadOrders();
    this.connectToEventStream();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnectFromEventStream();
  }

  private loadOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.orderEventService.fetchOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders: Order[]) => {
          this.orders.set(orders);
          this.isLoading.set(false);
        },
        error: (err: Error) => {
          this.error.set('Error al cargar las órdenes: ' + err.message);
          this.isLoading.set(false);
          this.snackBar.open('Error al cargar las órdenes', 'Reintentar', {
            duration: 5000
          }).onAction().subscribe(() => this.loadOrders());
        }
      });
  }

  private connectToEventStream(): void {
    try {
      this.orderEventService.connect();
      this.isConnected.set(true);
      this.startPollingFallback();
    } catch (err) {
      console.error('Error al conectar al stream de eventos:', err);
      this.isConnected.set(false);
      this.startPollingFallback();
    }
  }

  private disconnectFromEventStream(): void {
    try {
      this.orderEventService.disconnect();
      this.isConnected.set(false);
    } catch (err) {
      console.error('Error al desconectar del stream de eventos:', err);
    }

    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  private startPollingFallback(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    this.pollingSubscription = interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Polling de respaldo: actualizando órdenes');
        this.loadOrders();
      });
  }

  onRefresh(): void {
    this.loadOrders();
    this.snackBar.open('Órdenes actualizadas', 'OK', { duration: 2000 });
  }

  onToggleConnection(): void {
    if (this.isConnected()) {
      this.disconnectFromEventStream();
      this.snackBar.open('Desconectado del stream de eventos', 'OK', { duration: 2000 });
    } else {
      this.connectToEventStream();
    }
  }

  onSelectOrder(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders().find(order => order.id === orderId);
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}