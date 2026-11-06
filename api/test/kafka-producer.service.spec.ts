import { Test, TestingModule } from '@nestjs/testing';
import { KafkaProducerService } from '../src/infrastructure/kafka/kafka-producer.service';
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../src/domain/order.entity';
import { Kafka } from 'kafkajs';

jest.mock('kafkajs', () => {
  const mockProducer = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    send: jest.fn().mockResolvedValue(undefined),
  };

  return {
    Kafka: jest.fn().mockImplementation(() => ({
      producer: jest.fn().mockReturnValue(mockProducer),
    })),
    mockProducer,
  };
});

describe('KafkaProducerService', () => {
  let service: KafkaProducerService;
  let mockProducer: any;

  const mockOrderCreatedEvent: OrderCreatedEvent = {
    orderId: 'order-123',
    status: 'CREATED',
    items: [{ productId: 'prod-1', quantity: 2, price: 100 }],
  };

  const mockOrderUpdatedEvent: OrderUpdatedEvent = {
    orderId: 'order-123',
    status: 'PROCESSING',
  };

  const mockOrderCancelledEvent: OrderCancelledEvent = {
    orderId: 'order-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        {
          provide: 'KAFKA_CONFIG',
          useValue: {
            clientId: 'order-service',
            brokers: ['localhost:9092'],
          },
        },
      ],
    }).compile();

    service = module.get<KafkaProducerService>(KafkaProducerService);
    mockProducer = (Kafka as any).mockProducer;

    await service.onModuleInit();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    if (service.onModuleDestroy) {
      await service.onModuleDestroy();
    }
  });

  describe('publishOrderCreated', () => {
    it('debe publicar evento de orden creada exitosamente', async () => {
      await expect(
        service.publishOrderCreated(mockOrderCreatedEvent),
      ).resolves.not.toThrow();

      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-created',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: mockOrderCreatedEvent.orderId,
              value: JSON.stringify(mockOrderCreatedEvent),
            }),
          ]),
        }),
      );
    });

    it('debe manejar error al publicar evento de orden creada', async () => {
      mockProducer.send.mockRejectedValueOnce(new Error('Kafka connection failed'));

      await expect(
        service.publishOrderCreated(mockOrderCreatedEvent),
      ).rejects.toThrow('Kafka connection failed');
    });
  });

  describe('publishOrderUpdated', () => {
    it('debe publicar evento de orden actualizada exitosamente', async () => {
      await expect(
        service.publishOrderUpdated(mockOrderUpdatedEvent),
      ).resolves.not.toThrow();

      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-updated',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: mockOrderUpdatedEvent.orderId,
              value: JSON.stringify(mockOrderUpdatedEvent),
            }),
          ]),
        }),
      );
    });

    it('debe manejar error al publicar evento de orden actualizada', async () => {
      mockProducer.send.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        service.publishOrderUpdated(mockOrderUpdatedEvent),
      ).rejects.toThrow('Network error');
    });
  });

  describe('publishOrderCancelled', () => {
    it('debe publicar evento de orden cancelada exitosamente', async () => {
      await expect(
        service.publishOrderCancelled(mockOrderCancelledEvent),
      ).resolves.not.toThrow();

      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-cancelled',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: mockOrderCancelledEvent.orderId,
              value: JSON.stringify(mockOrderCancelledEvent),
            }),
          ]),
        }),
      );
    });

    it('debe manejar error al publicar evento de orden cancelada', async () => {
      mockProducer.send.mockRejectedValueOnce(new Error('Broker unavailable'));

      await expect(
        service.publishOrderCancelled(mockOrderCancelledEvent),
      ).rejects.toThrow('Broker unavailable');
    });
  });

  describe('onModuleInit', () => {
    it('debe conectar al broker de Kafka al inicializar', async () => {
      expect(mockProducer.connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('debe desconectar del broker de Kafka al destruir', async () => {
      await service.onModuleDestroy();
      expect(mockProducer.disconnect).toHaveBeenCalled();
    });
  });

  describe('manejo de eventos con datos nulos', () => {
    it('debe manejar evento de orden creada con items vacios', async () => {
      const eventWithEmptyItems: OrderCreatedEvent = {
        orderId: 'order-empty',
        status: 'CREATED',
        items: [],
      };

      await expect(
        service.publishOrderCreated(eventWithEmptyItems),
      ).resolves.not.toThrow();
    });

    it('debe manejar evento con orderId vacio', async () => {
      const eventWithEmptyId: OrderUpdatedEvent = {
        orderId: '',
        status: 'CANCELLED',
      };

      await expect(
        service.publishOrderUpdated(eventWithEmptyId),
      ).resolves.not.toThrow();
    });
  });
});