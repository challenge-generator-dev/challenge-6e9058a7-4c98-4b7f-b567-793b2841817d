import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord, Partitioners } from 'kafkajs';
import { OrderEventsPort } from '../../domain/order-events.port';
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../../domain/order.entity';

export interface KafkaModuleOptions {
  clientId: string;
  groupId: string;
  brokers: string[];
}

@Injectable()
export class KafkaProducerService implements OrderEventsPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private kafka: Kafka;
  private producer: Producer;
  private isConnected = false;
  private readonly topicName = 'order-events';

  constructor(@Inject('KAFKA_MODULE_OPTIONS') private readonly options: KafkaModuleOptions) {
    this.kafka = new Kafka({
      clientId: this.options.clientId,
      brokers: this.options.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
        factor: 2,
        maxRetryTime: 30000,
      },
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
      createPartitioner: Partitioners.DefaultPartitioner,
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
      this.logger.warn('Producer already connected to Kafka');
      return;
    }

    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.log(`Connected to Kafka broker: ${this.options.brokers.join(', ')}`);
    } catch (error) {
      this.logger.error('Failed to connect to Kafka broker', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      this.logger.log('Disconnected from Kafka broker');
    } catch (error) {
      this.logger.error('Error disconnecting from Kafka broker', error);
      throw error;
    }
  }

  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topicName,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            eventType: 'ORDER_CREATED',
            orderId: event.orderId,
            status: event.status,
            items: event.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            timestamp: new Date().toISOString(),
          }),
          headers: {
            'event-type': 'ORDER_CREATED',
            'correlation-id': event.orderId,
          },
        },
      ],
      acks: -1,
      timeout: 30000,
    };

    await this.sendMessage(record, 'ORDER_CREATED');
  }

  async publishOrderUpdated(event: OrderUpdatedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topicName,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            eventType: 'ORDER_UPDATED',
            orderId: event.orderId,
            status: event.status,
            timestamp: new Date().toISOString(),
          }),
          headers: {
            'event-type': 'ORDER_UPDATED',
            'correlation-id': event.orderId,
          },
        },
      ],
      acks: 1,
      timeout: 15000,
    };

    await this.sendMessage(record, 'ORDER_UPDATED');
  }

  async publishOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topicName,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            eventType: 'ORDER_CANCELLED',
            orderId: event.orderId,
            timestamp: new Date().toISOString(),
          }),
          headers: {
            'event-type': 'ORDER_CANCELLED',
            'correlation-id': event.orderId,
          },
        },
      ],
      acks: 1,
      timeout: 15000,
    };

    await this.sendMessage(record, 'ORDER_CANCELLED');
  }

  private async sendMessage(record: ProducerRecord, eventType: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error(`Cannot publish ${eventType}: Producer not connected to Kafka`);
    }

    try {
      await this.producer.send(record);
      this.logger.log(`Successfully published ${eventType} event for order: ${record.messages[0].key}`);
    } catch (error) {
      this.logger.error(`Failed to publish ${eventType} event`, {
        orderId: record.messages[0].key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  isProducerConnected(): boolean {
    return this.isConnected;
  }
}