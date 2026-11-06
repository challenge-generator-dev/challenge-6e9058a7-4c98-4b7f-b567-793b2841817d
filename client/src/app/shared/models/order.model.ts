import { InjectionToken } from '@angular/core';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  total: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  status: string;
  items: OrderItem[];
}

export interface OrderUpdatedEvent {
  orderId: string;
  status: string;
}

export interface OrderCancelledEvent {
  orderId: string;
}

export const ORDERS_API_URL = new InjectionToken<string>('ORDERS_API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000/api/orders'
});

export const ORDER_EVENTS_URL = new InjectionToken<string>('ORDER_EVENTS_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000/orders/orders.events'
});