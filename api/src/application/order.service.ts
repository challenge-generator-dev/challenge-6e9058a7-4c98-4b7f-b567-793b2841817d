import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { OrderEventsPort, OrderEventsConsumerPort } from '../domain/order-events.port';
import {
  Order,
  OrderItem,
  OrderCreatedEvent,
  OrderUpdatedEvent,
  OrderCancelledEvent,
} from '../domain/order.entity';

@Injectable()
export class OrderService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderService.name);
  private readonly orders: Map<string, Order> = new Map();
  private readonly eventHandlers: Map<string, (event: any) => Promise<void>> = new Map();
  private isConnected = false;
  private readonly retryAttempts = 3;
  private readonly retryDelayMs = 1000;

  constructor(
    private readonly orderEventsPort: OrderEventsPort,
    private readonly orderEventsConsumerPort: OrderEventsConsumerPort,
  ) {
    if (!orderEventsPort) {
      throw new Error('OrderEventsPort is required and cannot be null');
    }
    if (!orderEventsConsumerPort) {
      throw new Error('OrderEventsConsumerPort is required and cannot be null');
    }
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing OrderService...');
    this.setupEventHandlers();
    await this.connectToEventBus();
    this.logger.log('OrderService initialized successfully');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Shutting down OrderService...');
    this.orders.clear();
    this.eventHandlers.clear();
    this.isConnected = false;
    this.logger.log('OrderService shutdown complete');
  }

  private setupEventHandlers(): void {
    this.eventHandlers.set('order-created', async (event: OrderCreatedEvent) => {
      await this.handleOrderCreated(event);
    });

    this.eventHandlers.set('order-updated', async (event: OrderUpdatedEvent) => {
      await this.handleOrderUpdated(event);
    });

    this.eventHandlers.set('order-cancelled', async (event: OrderCancelledEvent) => {
      await this.handleOrderCancelled(event);
    });
  }

  private async connectToEventBus(): Promise<void> {
    let attempts = 0;
    while (attempts < this.retryAttempts) {
      try {
        this.orderEventsConsumerPort.subscribeToOrderCreated(
          async (event: OrderCreatedEvent) => {
            await this.handleOrderCreated(event);
          },
        );
        this.orderEventsConsumerPort.subscribeToOrderUpdated(
          async (event: OrderUpdatedEvent) => {
            await this.handleOrderUpdated(event);
          },
        );
        this.orderEventsConsumerPort.subscribeToOrderCancelled(
          async (event: OrderCancelledEvent) => {
            await this.handleOrderCancelled(event);
          },
        );
        this.isConnected = true;
        this.logger.log('Successfully connected to Kafka event bus');
        return;
      } catch (error) {
        attempts++;
        this.logger.warn(
          `Failed to connect to event bus (attempt ${attempts}/${this.retryAttempts}): ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        if (attempts < this.retryAttempts) {
          await this.delay(this.retryDelayMs * attempts);
        }
      }
    }
    this.logger.error('Could not connect to event bus after all retry attempts');
    throw new Error('Event bus connection failed');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private validateOrderId(orderId: string): void {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error('Order ID is required and cannot be empty');
    }
  }

  private validateOrderItems(items: OrderItem[]): void {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    for (const item of items) {
      if (!item.productId || item.productId.trim().length === 0) {
        throw new Error('Each order item must have a valid product ID');
      }
      if (item.quantity <= 0) {
        throw new Error('Item quantity must be greater than zero');
      }
      if (item.price < 0) {
        throw new Error('Item price cannot be negative');
      }
    }
  }

  private validateStatus(status: string): void {
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      throw new Error(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  async createOrder(orderId: string, status: string, items: OrderItem[]): Promise<Order> {
    this.validateOrderId(orderId);
    this.validateOrderItems(items);
    this.validateStatus(status);

    if (this.orders.has(orderId)) {
      throw new Error(`Order with ID ${orderId} already exists`);
    }

    const order = Order.createFromEvent(new OrderCreatedEvent(orderId, status, items));
    this.orders.set(orderId, order);
    this.logger.log(`Order created: ${orderId} with status ${status}`);

    const event = new OrderCreatedEvent(orderId, status, items);
    await this.publishWithRetry(() => this.orderEventsPort.publishOrderCreated(event));

    return order;
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order> {
    this.validateOrderId(orderId);
    this.validateStatus(newStatus);

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const oldStatus = order.status;
    order.updateStatus(newStatus);
    this.logger.log(`Order ${orderId} status updated from ${oldStatus} to ${newStatus}`);

    const event = new OrderUpdatedEvent(orderId, newStatus);
    await this.publishWithRetry(() => this.orderEventsPort.publishOrderUpdated(event));

    return order;
  }

  async cancelOrder(orderId: string): Promise<void> {
    this.validateOrderId(orderId);

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    if (order.status === 'COMPLETED') {
      throw new Error('Cannot cancel a completed order');
    }

    order.updateStatus('CANCELLED');
    this.logger.log(`Order cancelled: ${orderId}`);

    const event = new OrderCancelledEvent(orderId);
    await this.publishWithRetry(() => this.orderEventsPort.publishOrderCancelled(event));
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    this.validateOrderId(orderId);
    return this.orders.get(orderId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderCount(): Promise<number> {
    return this.orders.size;
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    this.validateStatus(status);
    const normalizedStatus = status.toUpperCase();
    return Array.from(this.orders.values()).filter(
      (order) => order.status.toUpperCase() === normalizedStatus,
    );
  }

  private async publishWithRetry(publishFn: () => Promise<void>): Promise<void> {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await publishFn();
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(
          `Failed to publish event (attempt ${attempt}/${this.retryAttempts}): ${lastError.message}`,
        );
        if (attempt < this.retryAttempts) {
          const delayMs = this.retryDelayMs * Math.pow(2, attempt - 1);
          await this.delay(delayMs);
        }
      }
    }
    this.logger.error(`Failed to publish event after ${this.retryAttempts} attempts: ${lastError?.message}`);
    throw new Error(`Event publication failed: ${lastError?.message}`);
  }

  private async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    try {
      if (!this.orders.has(event.orderId)) {
        const order = Order.createFromEvent(event);
        this.orders.set(event.orderId, order);
        this.logger.log(`Order created from event: ${event.orderId}`);
      } else {
        this.logger.warn(`Order already exists, skipping creation: ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling order created event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleOrderUpdated(event: OrderUpdatedEvent): Promise<void> {
    try {
      const order = this.orders.get(event.orderId);
      if (order) {
        order.updateStatus(event.status);
        this.logger.log(`Order updated from event: ${event.orderId} to status ${event.status}`);
      } else {
        this.logger.warn(`Order not found for update event: ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling order updated event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    try {
      const order = this.orders.get(event.orderId);
      if (order) {
        order.updateStatus('CANCELLED');
        this.logger.log(`Order cancelled from event: ${event.orderId}`);
      } else {
        this.logger.warn(`Order not found for cancellation event: ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling order cancelled event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}