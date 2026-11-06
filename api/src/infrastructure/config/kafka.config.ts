import { ConfigService } from '@nestjs/config';

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  consumer: KafkaConsumerConfig;
  producer: KafkaProducerConfig;
}

export interface KafkaConsumerConfig {
  groupId: string;
  sessionTimeout: number;
  heartbeatInterval: number;
  maxWaitTimeInMs: number;
  maxBytes: number;
  maxBytesPerPartition: number;
  autoOffsetReset: 'earliest' | 'latest';
  allowAutoCreateTopics: boolean;
  partitionAssigners: string[];
}

export interface KafkaProducerConfig {
  allowAutoCreateTopics: boolean;
  transactionTimeout: number;
  retry: KafkaRetryConfig;
  acks: 'all' | 'none' | '0' | '1';
  maxInFlightRequests: number;
 ENQUEUE_TIMEOUT: number;
}

export interface KafkaRetryConfig {
  initialRetryTime: number;
  retries: number;
  maxRetryTime: number;
  factor: number;
}

export const KAFKA_TOPICS = {
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_CANCELLED: 'order.cancelled',
} as const;

export function getKafkaConfig(configService: ConfigService): KafkaConfig {
  const brokersString = configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
  const brokers = brokersString.split(',').map(b => b.trim());

  return {
    clientId: configService.get<string>('KAFKA_CLIENT_ID', 'order-api'),
    brokers,
    consumer: {
      groupId: configService.get<string>('KAFKA_CONSUMER_GROUP_ID', 'order-consumer-group'),
      sessionTimeout: configService.get<number>('KAFKA_CONSUMER_SESSION_TIMEOUT', 30000),
      heartbeatInterval: configService.get<number>('KAFKA_CONSUMER_HEARTBEAT_INTERVAL', 3000),
      maxWaitTimeInMs: configService.get<number>('KAFKA_CONSUMER_MAX_WAIT_MS', 5000),
      maxBytes: configService.get<number>('KAFKA_CONSUMER_MAX_BYTES', 10485760),
      maxBytesPerPartition: configService.get<number>('KAFKA_CONSUMER_MAX_BYTES_PER_PARTITION', 1048576),
      autoOffsetReset: configService.get<'earliest' | 'latest'>('KAFKA_CONSUMER_AUTO_OFFSET_RESET', 'earliest'),
      allowAutoCreateTopics: configService.get<boolean>('KAFKA_ALLOW_AUTO_CREATE_TOPICS', false),
      partitionAssigners: configService.get<string[]>('KAFKA_CONSUMER_PARTITION_ASSIGNERS', ['roundRobin']),
    },
    producer: {
      allowAutoCreateTopics: configService.get<boolean>('KAFKA_PRODUCER_ALLOW_AUTO_CREATE_TOPICS', false),
      transactionTimeout: configService.get<number>('KAFKA_PRODUCER_TRANSACTION_TIMEOUT', 30000),
      retry: {
        initialRetryTime: configService.get<number>('KAFKA_PRODUCER_RETRY_INITIAL_TIME', 100),
        retries: configService.get<number>('KAFKA_PRODUCER_RETRY_RETRIES', 5),
        maxRetryTime: configService.get<number>('KAFKA_PRODUCER_RETRY_MAX_TIME', 3000),
        factor: configService.get<number>('KAFKA_PRODUCER_RETRY_FACTOR', 2),
      },
      acks: configService.get<'all' | 'none' | '0' | '1'>('KAFKA_PRODUCER_ACKS', 'all'),
      maxInFlightRequests: configService.get<number>('KAFKA_PRODUCER_MAX_IN_FLIGHT_REQUESTS', 5),
ENQUEUE_TIMEOUT: configService.get<number>('KAFKA_PRODUCER_ENQUEUE_TIMEOUT', 30000),
    },
  };
}

export function getTopicsToSubscribe(): string[] {
  return [
    KAFKA_TOPICS.ORDER_CREATED,
    KAFKA_TOPICS.ORDER_UPDATED,
    KAFKA_TOPICS.ORDER_CANCELLED,
  ];
}

export const KAFKA_PARTITION_STRATEGY = {
  ORDER_CREATED: 4,
  ORDER_UPDATED: 4,
  ORDER_CANCELLED: 2,
} as const;

export const KAFKA_REPLICATION_FACTOR = {
  ORDER_CREATED: 3,
  ORDER_UPDATED: 3,
  ORDER_CANCELLED: 3,
} as const;