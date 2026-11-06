import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderService } from '../../application/order.service';
import { OrderItem, OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../../domain/order.entity';

interface CreateOrderDto {
  orderId: string;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface UpdateOrderStatusDto {
  status: string;
}

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<{ orderId: string; status: string; message: string }> {
    this.logger.log(`Creating order: ${createOrderDto.orderId}`);
    
    if (!createOrderDto.orderId || !createOrderDto.status) {
      throw new BadRequestException('orderId and status are required');
    }

    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('items array must not be empty');
    }

    const items: OrderItem[] = createOrderDto.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    await this.orderService.createOrder(createOrderDto.orderId, createOrderDto.status, items);
    
    return {
      orderId: createOrderDto.orderId,
      status: createOrderDto.status,
      message: 'Order created successfully',
    };
  }

  @Get()
  async getAllOrders(): Promise<{ orders: Array<{ orderId: string; status: string; items: OrderItem[] }> }> {
    this.logger.log('Fetching all orders');
    
    const orders = await this.orderService.getAllOrders();
    
    return {
      orders: orders.map(order => ({
        orderId: (order as any).orderId,
        status: (order as any).status,
        items: (order as any).items,
      })),
    };
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string): Promise<{ orderId: string; status: string; items: OrderItem[] }> {
    this.logger.log(`Fetching order: ${orderId}`);
    
    const order = await this.orderService.getOrder(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return {
      orderId: (order as any).orderId,
      status: (order as any).status,
      items: (order as any).items,
    };
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ): Promise<{ orderId: string; status: string; message: string }> {
    this.logger.log(`Updating order status: ${orderId} to ${updateDto.status}`);
    
    if (!updateDto.status) {
      throw new BadRequestException('status is required');
    }

    const order = await this.orderService.updateOrderStatus(orderId, updateDto.status);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return {
      orderId: (order as any).orderId,
      status: (order as any).status,
      message: 'Order status updated successfully',
    };
  }

  @Delete(':orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelOrder(@Param('orderId') orderId: string): Promise<void> {
    this.logger.log(`Cancelling order: ${orderId}`);
    
    const order = await this.orderService.getOrder(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    await this.orderService.cancelOrder(orderId);
  }

  @Get('count/all')
  async getOrderCount(): Promise<{ count: number }> {
    this.logger.log('Fetching order count');
    
    const count = await this.orderService.getOrderCount();
    
    return { count };
  }

  @Get('status/:status')
  async getOrdersByStatus(@Param('status') status: string): Promise<{ orders: Array<{ orderId: string; status: string; items: OrderItem[] }> }> {
    this.logger.log(`Fetching orders by status: ${status}`);
    
    const orders = await this.orderService.getOrdersByStatus(status);
    
    return {
      orders: orders.map(order => ({
        orderId: (order as any).orderId,
        status: (order as any).status,
        items: (order as any).items,
      })),
    };
  }

  @Get('health/status')
  async healthCheck(): Promise<{ status: string; healthy: boolean }> {
    const isHealthy = this.orderService.isHealthy();
    
    return {
      status: isHealthy ? 'UP' : 'DOWN',
      healthy: isHealthy,
    };
  }
}