import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from './order.entity';

export interface OrderEventsPort {
  publishOrderCreated(event: OrderCreatedEvent): Promise<void>;
  publishOrderUpdated(event: OrderUpdatedEvent): Promise<void>;
  publishOrderCancelled(event: OrderCancelledEvent): Promise<void>;
}

export interface OrderEventsConsumerPort {
  subscribeToOrderCreated(handler: (event: OrderCreatedEvent) => Promise<void>): void;
  subscribeToOrderUpdated(handler: (event: OrderUpdatedEvent) => Promise<void>): void;
  subscribeToOrderCancelled(handler: (event: OrderCancelledEvent) => Promise<void>): void;
}