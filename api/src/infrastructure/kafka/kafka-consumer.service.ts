import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { OrderEventsConsumerPort } from '../../domain/order-events.port';
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent, OrderItem } from '../../domain/order.entity';
import { KafkaModuleOptions, KafkaProducerService } from './kafka-producer.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy, OrderEventsConsumerPort {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;
  private readonly topicName = 'order-events';
  private orderCreatedHandlers: Array<(event: OrderCreatedEvent) => Promise<void>> = [];
  private orderUpdatedHandlers: Array<(event: OrderUpdatedEvent) => Promise<void>> = [];
  private orderCancelledHandlers: Array<(event: OrderCancelledEvent) => Promise<void>> = [];
  private messageCount = 0;
  private errorCount = 0;

  constructor(
    @Inject('KAFKA_MODULE_OPTIONS') private readonly options: KafkaModuleOptions,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {
    this.kafka = new Kafka({
      clientId: `${this.options.clientId}-consumer`,
      brokers: this.options.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
        factor: 2,
        maxRetryTime: 30000,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: this.options.groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      rebalanceTimeout: 60000,
      maxWaitTimeInMs: 5000,
      maxBytes: 10485760,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('Consumer already connected to Kafka');
      return;
    }

    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log(`Consumer connected to Kafka broker: ${this.options.brokers.join(', ')}`);

      await this.consumer.subscribe({
        topic: this.topicName,
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });

      this.logger.log(`Subscribed to topic: ${this.topicName}`);
    } catch (error) {
      this.logger.error('Failed to connect consumer to Kafka broker', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      this.logger.log('Consumer disconnected from Kafka broker');
    } catch (error) {
      this.logger.error('Error disconnecting consumer from Kafka broker', error);
      throw error;
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;

    if (!message.value) {
      this.logger.warn('Received message with no value');
      return;
    }

    this.messageCount++;

    try {
      const eventData = JSON.parse(message.value.toString());
      const eventType = eventData.eventType || message.headers?.['event-type']?.toString();

      this.logger.debug(`Processing event: ${eventType} for order: ${eventData.orderId}`);

      switch (eventType) {
        case 'ORDER_CREATED':
          await this.processOrderCreated(eventData);
          break;
        case 'ORDER_UPDATED':
          await this.processOrderUpdated(eventData);
          break;
        case 'ORDER_CANCELLED':
          await this.processOrderCancelled(eventData);
          break;
        default:
          this.logger.warn(`Unknown event type: ${eventType}`);
      }
    } catch (error) {
      this.errorCount++;
      this.logger.error(`Error processing message from ${topic}:${partition}`, error);
      throw error;
    }
  }

  private async processOrderCreated(eventData: any): Promise<void> {
    const items: OrderItem[] = (eventData.items || []).map(
      (item: any) => new OrderItem(item.productId, item.quantity, item.price),
    );

    const event = new OrderCreatedEvent(eventData.orderId, eventData.status, items);

    for (const handler of this.orderCreatedHandlers) {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error('Error in ORDER_CREATED handler', error);
        throw error;
      }
    }
  }

  private async processOrderUpdated(eventData: any): Promise<void> {
    const event = new OrderUpdatedEvent(eventData.orderId, eventData.status);

    for (const handler of this.orderUpdatedHandlers) {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error('Error in ORDER_UPDATED handler', error);
        throw error;
      }
    }
  }

  private async processOrderCancelled(eventData: any): Promise<void> {
    const event = new OrderCancelledEvent(eventData.orderId);

    for (const handler of this.orderCancelledHandlers) {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error('Error in ORDER_CANCELLED handler', error);
        throw error;
      }
    }
  }

  subscribeToOrderCreated(handler: (event: OrderCreatedEvent) => Promise<void>): void {
    this.orderCreatedHandlers.push(handler);
    this.logger.log(`Subscribed new handler to ORDER_CREATED events. Total handlers: ${this.orderCreatedHandlers.length}`);
  }

  subscribeToOrderUpdated(handler: (event: OrderUpdatedEvent) => Promise<void>): void {
    this.orderUpdatedHandlers.push(handler);
    this.logger.log(`Subscribed new handler to ORDER_UPDATED events. Total handlers: ${this.orderUpdatedHandlers.length}`);
  }

  subscribeToOrderCancelled(handler: (event: OrderCancelledEvent) => Promise<void>): void {
    this.orderCancelledHandlers.push(handler);
    this.logger.log(`Subscribed new handler to ORDER_CANCELLED events. Total handlers: ${this.orderCancelledHandlers.length}`);
  }

  isConsumerConnected(): boolean {
    return this.isConnected;
  }

  getMetrics(): { messageCount: number; errorCount: number; isConnected: boolean } {
    return {
      messageCount: this.messageCount,
      errorCount: this.errorCount,
      isConnected: this.isConnected,
    };
  }

  async pause(): Promise<void> {
    await this.consumer.pause([{ topic: this.topicName }]);
    this.logger.log('Consumer paused');
  }

  async resume(): Promise<void> {
    await this.consumer.resume([{ topic: this.topicName }]);
    this.logger.log('Consumer resumed');
  }
}