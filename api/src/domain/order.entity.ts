export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
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

export class OrderEntity implements Order {
  id: string;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    status: string,
    items: OrderItem[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.status = status;
    this.items = items;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  updateStatus(newStatus: string): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
    this.updatedAt = new Date();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
    this.updatedAt = new Date();
  }

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  isValid(): boolean {
    return (
      this.id !== undefined &&
      this.id.length > 0 &&
      this.status !== undefined &&
      this.status.length > 0 &&
      this.items !== undefined &&
      this.items.length > 0
    );
  }

  toPlainObject(): Order {
    return {
      id: this.id,
      status: this.status,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromData(data: Partial<Order>): OrderEntity {
    return new OrderEntity(
      data.id || '',
      data.status || 'pending',
      data.items || [],
      data.createdAt,
      data.updatedAt,
    );
  }
}