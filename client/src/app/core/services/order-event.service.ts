import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, EMPTY, finalize, interval, mergeMap, retry, startWith, Subject, switchMap, tap } from 'rxjs';
import { Order, OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent, ORDER_EVENTS_URL, ORDERS_API_URL } from '@shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private readonly http = inject(HttpClient);
  private readonly ordersApiUrl = inject(ORDERS_API_URL);
  private readonly orderEventsUrl = inject(ORDER_EVENTS_URL);

  private ordersSignal = signal<Order[]>([]);
  private isPolling = signal<boolean>(false);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private eventSource: EventSource | null = null;

  orders = this.ordersSignal.asReadonly();

  private handleOrderCreated(event: OrderCreatedEvent): void {
    const existingOrderIndex = this.ordersSignal().findIndex(o => o.id === event.orderId);
    if (existingOrderIndex === -1) {
      const newOrder: Order = {
        id: event.orderId,
        status: event.status as Order['status'],
        items: event.items,
        createdAt: new Date(),
        updatedAt: new Date(),
        total: event.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      this.ordersSignal.update(orders => [...orders, newOrder]);
    }
  }

  private handleOrderUpdated(event: OrderUpdatedEvent): void {
    this.ordersSignal.update(orders =>
      orders.map(order =>
        order.id === event.orderId
          ? { ...order, status: event.status as Order['status'], updatedAt: new Date() }
          : order
      )
    );
  }

  private handleOrderCancelled(event: OrderCancelledEvent): void {
    this.ordersSignal.update(orders =>
      orders.map(order =>
        order.id === event.orderId
          ? { ...order, status: 'cancelled', updatedAt: new Date() }
          : order
      )
    );
  }

  private setupEventSource(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(this.orderEventsUrl);

    this.eventSource.addEventListener('order_created', (event) => {
      const data: OrderCreatedEvent = JSON.parse(event.data);
      this.handleOrderCreated(data);
    });

    this.eventSource.addEventListener('order_updated', (event) => {
      const data: OrderUpdatedEvent = JSON.parse(event.data);
      this.handleOrderUpdated(data);
    });

    this.eventSource.addEventListener('order_cancelled', (event) => {
      const data: OrderCancelledEvent = JSON.parse(event.data);
      this.handleOrderCancelled(data);
    });

    this.eventSource.onerror = () => {
      this.eventSource?.close();
      this.reconnectAttempts++;

      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        setTimeout(() => this.setupEventSource(), this.reconnectDelay);
      } else {
        this.startPolling();
      }
    };
  }

  private startPolling(): void {
    if (this.isPolling()) return;

    this.isPolling.set(true);
    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.fetchOrders()),
        retry({
          count: 3,
          delay: (error) => {
            console.error('Polling failed, retrying...', error);
            return interval(2000);
          }
        }),
        finalize(() => this.isPolling.set(false))
      )
      .subscribe();
  }

  fetchOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersApiUrl).pipe(
      tap(orders => {
        this.ordersSignal.set(orders);
      }),
      catchError(error => {
        console.error('Failed to fetch orders:', error);
        return EMPTY;
      })
    );
  }

  connect(): void {
    this.reconnectAttempts = 0;
    this.setupEventSource();
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isPolling.set(false);
  }
}