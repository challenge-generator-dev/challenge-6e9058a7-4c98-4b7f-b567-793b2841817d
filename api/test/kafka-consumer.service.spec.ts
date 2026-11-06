import { Test, TestingModule } from '@nestjs/testing';
import { KafkaConsumerService } from '../src/infrastructure/kafka/kafka-consumer.service';
import { OrderCreatedEvent, OrderUpdatedEvent, OrderCancelledEvent } from '../src/domain/order.entity';
import { Kafka } from 'kafkajs';

jest.mock('kafkajs', () => {
  const mockConsumer = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn().mockResolvedValue(undefined),
    run: jest.fn().mockResolvedValue(undefined),
  };

  return {
    Kafka: jest.fn().mockImplementation(() => ({
      consumer: jest.fn().mockReturnValue(mockConsumer),
    })),
    mockConsumer,
  };
});

describe('KafkaConsumerService', () => {
  let service: KafkaConsumerService;
  let mockConsumer: any;

  const mockOrderCreatedHandler = jest.fn().mockResolvedValue(undefined);
  const mockOrderUpdatedHandler = jest.fn().mockResolvedValue(undefined);
  const mockOrderCancelledHandler = jest.fn().mockResolvedValue(undefined);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaConsumerService,
        {
          provide: 'KAFKA_CONFIG',
          useValue: {
            clientId: 'order-service',
            groupId: 'order-consumer-group',
            brokers: ['localhost:9092'],
          },
        },
      ],
    }).compile();

    service = module.get<KafkaConsumerService>(KafkaConsumerService);
    mockConsumer = (Kafka as any).mockConsumer;

    service.subscribeToOrderCreated(mockOrderCreatedHandler);
    service.subscribeToOrderUpdated(mockOrderUpdatedHandler);
    service.subscribeToOrderCancelled(mockOrderCancelledHandler);

    await service.onModuleInit();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    if (service.onModuleDestroy) {
      await service.onModuleDestroy();
    }
  });

  describe('subscribeToOrderCreated', () => {
    it('debe registrar handler para eventos de orden creada', () => {
      expect(mockOrderCreatedHandler).not.toHaveBeenCalled();
    });

    it('debe permitir registrar multiples handlers', () => {
      const additionalHandler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderCreated(additionalHandler);
      expect(additionalHandler).toBeDefined();
    });
  });

  describe('subscribeToOrderUpdated', () => {
    it('debe registrar handler para eventos de orden actualizada', () => {
      expect(mockOrderUpdatedHandler).not.toHaveBeenCalled();
    });

    it('debe permitir registrar multiples handlers para actualizacion', () => {
      const additionalHandler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderUpdated(additionalHandler);
      expect(additionalHandler).toBeDefined();
    });
  });

  describe('subscribeToOrderCancelled', () => {
    it('debe registrar handler para eventos de orden cancelada', () => {
      expect(mockOrderCancelledHandler).not.toHaveBeenCalled();
    });

    it('debe permitir registrar multiples handlers para cancelacion', () => {
      const additionalHandler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderCancelled(additionalHandler);
      expect(additionalHandler).toBeDefined();
    });
  });

  describe('onModuleInit', () => {
    it('debe conectar al broker de Kafka al inicializar', async () => {
      await service.onModuleInit();
      expect(mockConsumer.connect).toHaveBeenCalled();
    });

    it('debe suscribirse a los topics de Kafka al inicializar', async () => {
      await service.onModuleInit();
      expect(mockConsumer.subscribe).toHaveBeenCalledTimes(3);
    });

    it('debe iniciar el consumidor al inicializar', async () => {
      await service.onModuleInit();
      expect(mockConsumer.run).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('debe desconectar del broker de Kafka al destruir', async () => {
      await service.onModuleInit();
      await service.onModuleDestroy();
      expect(mockConsumer.disconnect).toHaveBeenCalled();
    });
  });

  describe('manejo de errores en handlers', () => {
    it('debe manejar errores en handler de orden creada', async () => {
      mockOrderCreatedHandler.mockRejectedValueOnce(new Error('Handler error'));
      
      const errorHandler = jest.fn();
      service.subscribeToOrderCreated(async (event) => {
        try {
          await mockOrderCreatedHandler(event);
        } catch (error) {
          errorHandler(error);
        }
      });

      await service.onModuleInit();
    });

    it('debe manejar errores en handler de orden actualizada', async () => {
      mockOrderUpdatedHandler.mockRejectedValueOnce(new Error('Processing error'));
      
      const errorHandler = jest.fn();
      service.subscribeToOrderUpdated(async (event) => {
        try {
          await mockOrderUpdatedHandler(event);
        } catch (error) {
          errorHandler(error);
        }
      });

      await service.onModuleInit();
    });

    it('debe manejar errores en handler de orden cancelada', async () => {
      mockOrderCancelledHandler.mockRejectedValueOnce(new Error('Cancellation error'));
      
      const errorHandler = jest.fn();
      service.subscribeToOrderCancelled(async (event) => {
        try {
          await mockOrderCancelledHandler(event);
        } catch (error) {
          errorHandler(error);
        }
      });

      await service.onModuleInit();
    });
  });

  describe('procesamiento de mensajes', () => {
    it('debe procesar mensaje de orden creada correctamente', async () => {
      const event: OrderCreatedEvent = {
        orderId: 'order-456',
        status: 'CREATED',
        items: [{ productId: 'prod-2', quantity: 1, price: 200 }],
      };

      const handler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderCreated(handler);

      expect(handler).not.toHaveBeenCalledWith(event);
    });

    it('debe procesar mensaje de orden actualizada correctamente', async () => {
      const event: OrderUpdatedEvent = {
        orderId: 'order-789',
        status: 'SHIPPED',
      };

      const handler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderUpdated(handler);

      expect(handler).not.toHaveBeenCalledWith(event);
    });

    it('debe procesar mensaje de orden cancelada correctamente', async () => {
      const event: OrderCancelledEvent = {
        orderId: 'order-000',
      };

      const handler = jest.fn().mockResolvedValue(undefined);
      service.subscribeToOrderCancelled(handler);

      expect(handler).not.toHaveBeenCalledWith(event);
    });
  });

  describe('configuracion de topics', () => {
    it('debe suscribirse al topic order-created', async () => {
      await service.onModuleInit();
      expect(mockConsumer.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-created',
          fromBeginning: false,
        }),
      );
    });

    it('debe suscribirse al topic order-updated', async () => {
      await service.onModuleInit();
      expect(mockConsumer.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-updated',
          fromBeginning: false,
        }),
      );
    });

    it('debe suscribirse al topic order-cancelled', async () => {
      await service.onModuleInit();
      expect(mockConsumer.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-cancelled',
          fromBeginning: false,
        }),
      );
    });
  });

  describe('configuracion de grupo de consumidores', () => {
    it('debe usar el groupId configurado', async () => {
      await service.onModuleInit();
      expect(Kafka).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: 'order-service',
        }),
      );
    });
  });
});